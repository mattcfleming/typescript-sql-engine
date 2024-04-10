// A basic, in-memory, simplified SQL engine in TypeScript

type Row = Record<string, any>;
type Table = Row[];

class TSQLDatabase {
  private tables: Record<string, Table> = {};

  constructor() {
    this.tables = {};
  }

  // Parse and execute SQL command
  public executeSQL(sql: string): any {
    const command = sql.split(' ')[0].toUpperCase();
    switch (command) {
      case 'CREATE':
        return this.createTable(sql);
      case 'INSERT':
        return this.insertIntoTable(sql);
      case 'SELECT':
        return this.selectFromTable(sql);
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }

  private createTable(sql: string): void {
    const tableName = sql.split(' ')[2];
    this.tables[tableName] = [];
  }

  private insertIntoTable(sql: string): void {
    const match = sql.match(/INSERT INTO (\w+) VALUES \((.*)\)/i);
    if (!match) throw new Error('Parse error');
    const [, tableName, valuesString] = match;
    const values = valuesString
      .split(',')
      .map((value) => value.trim());
    const row: Row = {};

    // This is a simplification. In a real scenario, you would match values to columns.
    values.forEach((value, index) => {
      row[`column${index}`] = value;
    });

    this.tables[tableName].push(row);
  }

  private selectFromTable(sql: string): Table {
    const match = sql.match(/SELECT \* FROM (\w+)/i);
    if (!match) throw new Error('Parse error');
    const [, tableName] = match;

    return this.tables[tableName];
  }
}

// Example usage
const db = new TSQLDatabase();
db.executeSQL('CREATE TABLE users');
db.executeSQL("INSERT INTO users VALUES ('Alice', '25')");
db.executeSQL("INSERT INTO users VALUES ('Bob', '30')");
console.log(db.executeSQL('SELECT * FROM users'));
