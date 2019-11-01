// @flow
import '@babel/polyfill';
import 'core-js/shim';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavItem, Table, PageHeader, Button} from 'react-bootstrap';
import './index.scss';
import type, {Pickup, Item} from '../Common';

setTimeout(() => {
  const mountElement = document.getElementById('mount');
  if (!mountElement) throw new Error(`Element to mount not found.`);
  render(<Website />, mountElement);
});

function Website() {
  return (
    <BrowserRouter>
      <div style={{maxWidth: 960, margin: '0 auto'}}>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to='/'>
                <a>Remoov</a>
              </LinkContainer>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <LinkContainer to='/pickups'>
              <NavItem eventKey={1}>Pickups</NavItem>
            </LinkContainer>
            <LinkContainer to='/items'>
              <NavItem eventKey={2}>Items</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar>
        <div style={{padding: '0 20px'}}>
          <Switch>
            <Route exact path='/' render={() => <Home />} />
            <Route exact path='/pickups' render={() => <Pickups />} />
            <Route exact path='/items' render={() => <Items />} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}
function Home() {
  return (
    <div>
      <PageHeader>Home</PageHeader>
      <p>Welcome to Remoov!</p>
      <p>Use the links above to check the other pages.</p>
    </div>
  );
}
class Pickups extends PureComponent<{}, {pickups: Pickup[]}> {
  async componentDidMount() {
    const pickups = await post().getPickups();
    this.setState({pickups});
  }
  render() {
    if (!this.state) return null;
    const {pickups} = this.state;
    return (
      <div>
        <PageHeader>Pickups</PageHeader>
        <Button style={{float: 'right'}} href='pickups.json'>
          Download JSON
        </Button>
        <Button style={{float: 'right'}} href='pickups.csv'>
          Download CSV
        </Button>
        {!pickups && <p>Loading...</p>}
        {pickups && (
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Tags</th>
                <th>Price</th>
                <th>Item IDs</th>
                <th>Balance Due</th>
              </tr>
            </thead>
            <tbody>
              {pickups.map(({id, name, tags, price, itemIds}, index) => (
                <tr key={index}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{tags.join(',')}</td>
                  <td>{price}</td>
                  <td>{itemIds.join(',')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  }
}
class Items extends PureComponent<{}, {items: Item[]}> {
  async componentDidMount() {
    const items = await post().getItems();
    this.setState({items});
  }
  render() {
    if (!this.state) return null;
    const {items} = this.state;
    return (
      <div>
        <PageHeader>Items</PageHeader>
        {!items && <p>Loading...</p>}
        {items && (
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Pickup ID</th>
                <th>Title</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Sold</th>
              </tr>
            </thead>
            <tbody>
              {items.map(
                ({id, pickup_id, title, unit_price, quantity, sold}, index) => (
                  <tr key={index}>
                    <td>{id}</td>
                    <td>{pickup_id}</td>
                    <td>{title}</td>
                    <td>{unit_price}</td>
                    <td>{quantity}</td>
                    <td>{sold ? 'Yes' : 'No'}</td>
                  </tr>
                ),
              )}
            </tbody>
          </Table>
        )}
      </div>
    );
  }
}

function post() {
  return {
    getPickups: () => postData('getPickups'),
    getItems: () => postData('getItems'),
  };

  async function postData(execute, args = []) {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({execute, args}),
    });
    return response.json();
  }
}
