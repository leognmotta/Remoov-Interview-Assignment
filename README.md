# Remoov Interview Assignment

## Setup

Install:
- node 11.14.0
- yarn 1.19.1

Then run:

```
yarn
yarn reset-db
yarn dev
```

And open localhost:5000 in your browser.

## Task

### Task A

Add a column `Balance Due` to the pickup listing view:
- This should be calculated with the following formula:
  (pickup price) - (sum of all items (unit_price * quantity))
- Ideally this function should be in the Common.js file
- You can write tests to this function in the CommonTest.js file

### Task B

Add a button to the website to download the pickup CSV file.
This file should have the following format:

- Column `ID` with the pickup id
- Column `Name` with the name of the customer
- Column `Tags` with a list of tags separated by a comma
- Column `Balance Due` with the value calculated in the previous task

Example:

```
ID  Name  Tags          Balance Due
1   John  aaa,bbb,ccc   $50
2   Mark  ccc,ddd       $100
```
