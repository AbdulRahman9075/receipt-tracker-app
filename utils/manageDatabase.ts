import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { ReceiptJSON,Item,processJSON,formatDate} from './utilities';

// file
export const DBNAME: string = 'records.db';
export const DB_PATH = `${FileSystem.documentDirectory}SQLite/${DBNAME}`;

//schema
export const itemSchema = `
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS allitems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      itemname TEXT NOT NULL,
      unitprice REAL NOT NULL,
      totalprice REAL NOT NULL,
      quantity REAL NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
    );`;

export const accountsSchema = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  currency TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

//accounts
export type Account = {
  name: string;
  currency: string;
};


export const addAccount =  async (account: Account) =>{
  const db = await SQLite.openDatabaseAsync(DBNAME);
  await db.execAsync(accountsSchema);
  console.log("Creating Account----");
  await db.runAsync(
    `INSERT INTO accounts (name, currency) VALUES (?, ?)`,
      account.name,
      account.currency,
    );
  console.log('SUCCESS: account created');
}

export const loadAccounts = async (): Promise<Account[] | { error: string } | undefined> => {
  console.log('loading accounts-----');
  const db = await SQLite.openDatabaseAsync(DBNAME);

  try {
    // Check if table exists
    const tableCheck = await db.getAllAsync<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'`
    );

    if (tableCheck.length === 0) {
      console.log('SUCCESS: No Account Found');
      return;
    }

    // Fetch accounts
    const rows = await db.getAllAsync<Account>(
      'SELECT * FROM accounts ORDER BY created_at DESC'
    );

    if (rows.length === 0) {
      console.log('SUCCESS: No Account Found');
      return;
    }

    console.log('SUCCESS: ACCOUNTS LOADED');
    return rows;

  } catch (err) {
    console.error('ERROR loading accounts:', err);
    return { error: 'Failed to load accounts. Please try again.' };
  }
};

export const getAccountCurrency = async (account_id: number) => {
  console.log('loading currency-----');
  const db = await SQLite.openDatabaseAsync(DBNAME);

  const result = await db.getFirstAsync<{ currency: string }>(
    'SELECT currency FROM accounts WHERE id = ?',
    [account_id]
  );

  return result?.currency ?? null;
};

export const deleteAccount =  async (account_id:number) => {
  const db = await SQLite.openDatabaseAsync(DBNAME);

  await db.runAsync(
    'DELETE FROM accounts WHERE id = ?',
    [account_id]
  );
  //add deletion of calculation tables
  console.log(`SUCCESS: Deleted accountid:${account_id}`);
}

//items
export const saveToDatabase =  async (receiptresponse: ReceiptJSON,account_id: number) =>{
  console.log('saving data----');
  const items: Item[] = processJSON(receiptresponse);
  const db = await SQLite.openDatabaseAsync(DBNAME);
  console.log('file opened creating table');
  await db.execAsync(itemSchema);
  let i =0
  for (const item of items) {
    await db.runAsync(
      `INSERT INTO allitems (
        account_id, itemname, unitprice, totalprice, quantity, location, date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      account_id,
      item.itemname,
      item.unitprice,
      item.totalprice,
      item.quantity,
      item.location,
      item.date
    );
    console.log(`added item ${i}`);
    i++;
  }
  console.log('SUCCESS: SAVING COMPLETE');
}

export const loadfromDatabase = async (account_id: number): Promise<Item[]> => {
  console.log('opening database-----');
  const db = await SQLite.openDatabaseAsync(DBNAME);
  console.log('generating rows---');
  const rows = await db.getAllAsync<Item>(
  `SELECT * 
   FROM allitems 
   WHERE account_id = ? 
   ORDER BY datetime(date) DESC`,
  [account_id]
);
  // sort in descending order
  // rows.sort((a, b) => {
  //   const dateA = new Date(a.date).getTime();
  //   const dateB = new Date(b.date).getTime();
  //   return dateB - dateA; // Descending
  // });
  console.log('SUCCESS: DATABASE LOADED for: ',account_id);
  return rows;
};

// export const clearData =  async () => {
//   const db = await SQLite.openDatabaseAsync(DBNAME);

//   const tablesResult = await db.getAllAsync<{ name: string }>(
//     `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
//   );

//   // Iterate and delete data from each table
//   for (const { name } of tablesResult) {
//     await db.runAsync(`DELETE FROM ${name};`);
//     console.log(`Cleared table: ${name}`);
//   }

//   console.log('SUCCESS: All data cleared');
// }

export const clearData =  async (account_id:number) => {
  const db = await SQLite.openDatabaseAsync(DBNAME);

  await db.runAsync(
    'DELETE FROM allitems WHERE account_id = ?',
    [account_id]
  );
  //add deletion of calculation tables
  console.log(`SUCCESS: All data for accountid:${account_id} cleared`);
}
export const deleteSingleItem =  async (account_id:number,id:number) => {
  const db = await SQLite.openDatabaseAsync(DBNAME);

  await db.runAsync(
    'DELETE FROM allitems WHERE account_id = ? AND id = ?',
    [account_id,id]
  );

  console.log(`SUCCESS: Deleted id=${id} of accountid:${account_id}`);
}


export const addEntry =  async (item: Item,account_id:number) =>{
  console.log('saving SINGLE item:',item);
  console.log("accountid= ",account_id);
  const db = await SQLite.openDatabaseAsync(DBNAME);
  await db.execAsync(itemSchema);
  await db.runAsync(
      `INSERT INTO allitems (
        account_id, itemname, unitprice, totalprice, quantity, location, date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      account_id,
      item.itemname,
      item.unitprice,
      item.totalprice,
      item.quantity,
      item.location,
      item.date,
    );
  console.log(`${item.date}`);
  console.log(`SUCCESS: SINGLE item saved to: ${account_id}`);
}

type FilterOptions = {
  startDate: Date; 
  endDate: Date;
  min: number;
  max: number;
  constant: number;
};

//filter
export const applyFilters = async (filters: FilterOptions,account_id:number): Promise<Item[]> => {
  console.log("applying filter-------");
  const db = await SQLite.openDatabaseAsync(DBNAME);
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.startDate === undefined && filters.endDate) {
    conditions.push('date <= ?');
    params.push(formatDate(filters.endDate));
  }

  if (filters.endDate === undefined && filters.startDate) {
    conditions.push('date >= ?');
    params.push(formatDate(filters.startDate));
  }

  if (filters.startDate && filters.endDate) {
    conditions.push('date BETWEEN ? AND ?');
    params.push(formatDate(filters.startDate),formatDate(filters.endDate));
  }

  if (!isNaN(filters.constant) && filters.constant !== Infinity) {
      conditions.push('totalprice = ?');
      params.push(filters.constant);
    
  }
  else if(isNaN(filters.constant)){
    if(filters.min !== Infinity && filters.max === Infinity){
      conditions.push('totalprice > ?');
      params.push(filters.min);
    }
    if(filters.max !== Infinity && filters.min === Infinity){
      conditions.push('totalprice < ?');
      params.push(filters.max);
    }
    if(filters.min !== Infinity && filters.max !== Infinity){
      conditions.push('totalprice BETWEEN ? AND ?');
      params.push(filters.min,filters.max);
    }
  }

  const baseCondition = 'account_id = ?';
  const whereClause = conditions.length > 0 
  ? `${baseCondition} AND ${conditions.join(' AND ')}`
  : baseCondition;

  const query = `SELECT * FROM allitems WHERE ${whereClause} ORDER BY date DESC`;

  const fullParams = [account_id, ...params];
  const rows = await db.getAllAsync<Item>(query, fullParams);

  console.log(`SUCCESS- filter applied: ${query} `);
  console.log(fullParams);
  console.log(rows);
  return rows;
};

//search
export const searchDB = async (query: string,account_id: number): Promise<Item[]> => { 
  console.log(`${query}   ${account_id}`)
  const db = await SQLite.openDatabaseAsync(DBNAME);
  const results=  await db.getAllAsync<Item>(
      'SELECT * FROM allitems WHERE account_id = ? AND itemname LIKE ? COLLATE NOCASE ORDER BY date DESC',
      [account_id,`%${query}%`]
  );
  console.log(results);
  return results;

}

// monthlysum

export const monthlySum = async (account_id: number): Promise<{ month: string; year: string; sum: number }[]> => {
  const db = await SQLite.openDatabaseAsync(DBNAME);

  const items = await db.getAllAsync<Item>(
    'SELECT * FROM allitems WHERE account_id = ?',
    [account_id]
  );

  const sumsMap: Record<string, { sum: number; sortKey: number }> = {};

  for (const item of items) {
    const dateObj = new Date(item.date);
    const monthShort = dateObj.toLocaleString('en-US', { month: 'short' }); // "Aug"
    const year = String(dateObj.getFullYear());
    const key = `${monthShort}-${year}`;

    // numeric key like 202508 for Aug 2025 (year * 100 + monthNumber)
    const sortKey = dateObj.getFullYear() * 100 + (dateObj.getMonth() + 1);

    if (!sumsMap[key]) sumsMap[key] = { sum: 0, sortKey };
    sumsMap[key].sum += item.totalprice;
  }

  // Convert to array and sort by sortKey DESC (newest month first)
  const sumsWithKey = Object.entries(sumsMap).map(([key, { sum, sortKey }]) => {
    const [month, year] = key.split('-');
    return { month, year, sum, sortKey };
  });

  sumsWithKey.sort((a, b) => b.sortKey - a.sortKey);

  // return without exposing sortKey
  return sumsWithKey.map(({ month, year, sum }) => ({ month, year, sum }));
};

