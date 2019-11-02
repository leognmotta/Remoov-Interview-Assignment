// @flow
import 'source-map-support/register';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import type {Pickup, Item} from './Common';
import {
  centsToDollars,
  intToBoolean,
  getBalanceDue,
  formatNumberToDollar,
} from './Common';
import {parse} from 'json2csv';
const PORT = 5000;

const fromRootPath = (p) => path.join(process.cwd(), p);
const dbConnection = new sqlite3.Database(fromRootPath('./tmp/db.sqlite'));

express()
  .use('/assets', express.static('tmp/'))
  .get(['/', '/pickups', '/items'], sendPage)
  .get('/pickups.json', sendPickupsJson)
  .get('/pickups.csv', sendPickupsCSV)
  .use(bodyParser.json({limit: '50mb'}))
  .use(bodyParser.urlencoded({limit: '50mb', extended: true}))
  .post('/api', apiPost)
  .listen(PORT, () => log(`Up at localhost:${String(PORT)}.`));

function sendPage(_: any, response: any): void {
  return response.sendFile(fromRootPath('tmp/index.html'));
}

async function sendPickupsJson(request: any, response: any): Promise<void> {
  try {
    const {body} = request;
    log(`request ${JSON.stringify(body)}`);
    const pickups = await db().loadPickups();
    const pickupsJson = JSON.stringify(pickups);
    log(`success ${pickupsJson}`);
    response.setHeader('Content-Type', 'application/json');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="pickups-${Date.now()}.json"`,
    );
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Pragma', 'no-cache');
    response.status(200).send(pickupsJson);
    return;
  } catch (error) {
    log(`error: ${error.message}`);
    return response.status(400).json(error.message);
  }
}

async function sendPickupsCSV(request: any, response: any): Promise<void> {
  try {
    const {body} = request;
    log(`request ${JSON.stringify(body)}`);
    const pickups = await db().loadPickups();
    const pickupsJson = JSON.stringify(pickups);
    log(`success ${pickupsJson}`);
    const pickupCSV = json2CSV(pickupsJson);
    log(`success ${pickupCSV}`);
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="pickups-${Date.now()}.csv"`,
    );
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Pragma', 'no-cache');
    response.status(200).send(pickupCSV);
    return;
  } catch (error) {
    log(`error: ${error.message}`);
    return response.status(400).json(error.message);
  }
}

async function apiPost(request: any, response: any): Promise<void> {
  try {
    const {body} = request;
    log(`request ${JSON.stringify(body)}`);
    const {execute} = body;
    if (execute === 'getPickups') {
      const pickups = await db().loadPickups();
      log(`success ${JSON.stringify(pickups)}`);
      response.status(200).json(pickups || null);
      return;
    }
    if (execute === 'getItems') {
      const items = await db().loadItems();
      log(`success ${JSON.stringify(items)}`);
      response.status(200).json(items || null);
      return;
    }
    throw new Error(`Invalid execute: '${execute}'.`);
  } catch (error) {
    log(`error: ${error.message}`);
    return response.status(400).json(error.message);
  }
}

function db(): * {
  return {loadPickups, loadItems};

  async function loadPickups(): Promise<Pickup[]> {
    const pickupRows = await selectAll('SELECT * FROM pickups');
    const pickupTagRows = await selectAll('SELECT * FROM pickups_tags');
    const tagRows = await selectAll('SELECT * FROM tags');
    const itemRows = await selectAll('SELECT * FROM items');
    return pickupRows.map(({id, name, price_in_cents}) => {
      const tagIds = pickupTagRows
        .filter(({pickup_id}) => pickup_id === id)
        .map(({tag_id}) => tag_id);
      const tags = tagRows
        .filter(({id}) => tagIds.includes(id))
        .map(({name}) => name);
      const items = itemRows.filter(({pickup_id}) => pickup_id === id);
      const itemIds = items.map(({id}) => id);
      const balance_due = getBalanceDue(items, price_in_cents);
      return {
        id,
        name,
        price: centsToDollars(price_in_cents),
        formatted_price: formatNumberToDollar(centsToDollars(price_in_cents)),
        itemIds,
        tags,
        balance_due: centsToDollars(balance_due),
        formatted_balance_due: formatNumberToDollar(
          centsToDollars(balance_due),
        ),
      };
    });
  }

  async function loadItems(): Promise<Item[]> {
    const itemRows = await selectAll('SELECT * FROM items');
    return itemRows.map(
      ({id, pickup_id, title, unit_price_in_cents, quantity, sold}) => ({
        id,
        pickup_id,
        title,
        unit_price_in_cents: unit_price_in_cents,
        unit_price: centsToDollars(unit_price_in_cents),
        formatted_unit_price: formatNumberToDollar(
          centsToDollars(unit_price_in_cents),
        ),
        quantity,
        sold: intToBoolean(sold),
      }),
    );
  }

  async function selectAll(query: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      dbConnection.all(query, params, (err, rows) => {
        return err ? reject(err) : resolve(rows);
      });
    });
  }
}

function json2CSV(data) {
  const parsedData = JSON.parse(data);

  const fields = [
    {
      label: 'ID',
      value: 'id',
    },
    {
      label: 'Name',
      value: 'name',
    },
    {
      label: 'Tags',
      value: 'tags',
    },
    {
      label: 'Balance Due',
      value: 'balance_due',
    },
  ];

  const opts = {fields};

  const processedData = parsedData.map(({id, name, tags, balance_due}) => {
    return {
      id,
      name,
      tags: tags.join(','),
      balance_due,
    };
  });

  return parse(processedData, opts);
}

function log(...messages): void {
  /* eslint-disable no-console */
  console.log(...messages);
  /* eslint-enable no-console */
}
