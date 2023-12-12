// server.js
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const compression = require('compression');


const app = express();
const PORT = 5000;

// Use the compression middleware
app.use(compression());


// Enable CORS for all routes

// const corsOptions = {
//     origin: 'http://localhost:4200', // Your Angular app's URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // enable set cookie
//     optionsSuccessStatus: 204,
//   };

app.use(cors());


// Use middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//   secret: '12dwe23fs23sdwr34xfwer53434', // Secrect key
//   resave: true,
//   saveUninitialized: true
// }));


// JWT Secret Key
const jwtSecretKey = 'mybudgetapp'; // Replace with a strong secret key

// Function to generate a JWT
const generateJWT = (userId) => {
  return new Promise((resolve, reject) => {
    // { expiresIn: '1h' }
    jwt.sign({ 'userId':userId }, jwtSecretKey,  (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

//validation jwt token
const authenticateToken = (req, res, next) => {
    // Get the token from the request header, query parameters, or cookies
    const token = req.headers.authorization || req.query.token || req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
  
      // Attach the decoded payload to the request for further use
      req.user = decoded;
      console.log('user -------------',decoded);
  
      // Continue to the next middleware or route handler
      next();
    });
  };

  const db = mysql.createConnection({
    host: 'mezmermedia.ciz1tweq614z.eu-west-2.rds.amazonaws.com',
    user: 'mezmerroot',
    password: 'MezMerHyd',
    database: 'test_db',
  
  });

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Routes
app.post('/signup', async (req, res) => {
  // Implement signup logic here
  console.log('signup');
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  const values = [name, email, hashedPassword];

  db.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error('Error executing INSERT query:', error);
      res.status(500).json({ error: 'Internal Server Error' ,code: error.code });
    } else {
      console.log('User registered successfully');
      res.status(201).json({ message: 'User registered successfully' });
    }
    });
});

app.post('/login', async (req, res) => {
  // Implement login logic here

  try {
    const { email, password } = req.body;

    const selectQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(selectQuery, [email], async (error, results) => {
    if (error) {
      console.error('Error executing SELECT query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, results[0].password);

      if (isPasswordValid) {
        // Passwords match, user is authenticated
        console.log(results[0].id);
         // If everything success then generate the token
        const token = await generateJWT(results[0].id);

        return res.json({ ok: true, token });

        // res.json({ message: 'Login successful', user: results[0] });
      } else {
        // Passwords do not match
        res.status(401).json({ error: "Wrong email or password, try again.", errcode: 20 });
      }
    }
  });

  
   
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error.", errcode: 21 });
  }
  
});


app.get('/test_budgets', (req, res) => {

    console.log('ai');
    const userId = 12;
    console.log(userId);
    const query = 'SELECT * FROM config_budgets where user_id='+userId + ' order by id desc'; // Replace with your table name
    
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error executing SELECT query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Return the results as JSON
        res.json(results);
      }
    });

});


app.get('/config_budgets', authenticateToken, (req, res) => {
    // Perform a SELECT query
    console.log('ai');
    const userId = req.user.userId;
    console.log(userId);
    const query = 'SELECT * FROM config_budgets where user_id='+userId + ' order by id desc'; // Replace with your table name
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error executing SELECT query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Return the results as JSON
        res.json(results);
      }
    });
  });

  app.post('/create_budget',authenticateToken, async (req, res) => {
    const { name, amount } = req.body;
    const userId = req.user.userId;
    const insertQuery = 'INSERT INTO config_budgets (name, amount, user_id) VALUES (?, ?,?)';
    const values = [name, amount, userId];
    
    db.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Error executing INSERT query:', error);
        res.status(500).json({ error: 'Internal Server Error' ,code: error.code });
      } else {
        console.log('Budget creation successfully');
        res.status(200).json({ message: 'Budget creation successfully' });
      }
      });
  });

  app.get('/expenses', authenticateToken, (req, res) => {
    // Perform a SELECT query
    const userId = req.user.userId;
    const query = 'SELECT e.*,b.name FROM expenses e join config_budgets b on b.id=e.config_budget_id   where e.user_id='+userId + ' order by e.id desc'; // Replace with your table name
    
    const query_budget = 'select id,name from config_budgets where user_id='+userId + ' order by name asc';

    var BudgetList;
    db.query(query_budget, (error, results) => {
        BudgetList = results;
    });
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error executing SELECT query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Return the results as JSON
        res.status(200).json({'data' : results, 'budget_list':BudgetList});
      }
    });
  });

  app.get('/dashboard', authenticateToken, (req, res) => {
    // Perform a SELECT query
    const userId = req.user.userId;

    const query = 'SELECT sum(e.amount) as myExpense, sum(b.amount) as myBudget  FROM expenses e join config_budgets b on b.id=e.config_budget_id   where e.user_id='+userId + ' order by e.id desc'; // Replace with your table name
    
    const query_budget = 'select b.name, sum(b.amount) as budget_amount, sum(e.amount) as exp_amount from config_budgets b join expenses e on b.id=e.config_budget_id  where e.user_id='+userId + ' group by b.name';

    const query_expenses = 'select month,sum(amount) as amount from expenses where user_id='+userId + ' group by month';

    var monthlyExpenses;

    db.query(query_expenses, (error, results) => {
        monthlyExpenses = results;
    });

    var BudgetList;
    db.query(query_budget, (error, results) => {
        BudgetList = results;
    });
    console.log('budge,'+BudgetList);
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error executing SELECT query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Return the results as JSON
        res.status(200).json({'exp_budget' : results, 'budget_expenses':BudgetList,'monthly_expenses':monthlyExpenses});
      }
    });
  });

  app.post('/create_expenses',authenticateToken, async (req, res) => {
    const { description, amount,config_budget_id,month } = req.body;
    const userId = req.user.userId;
    const insertQuery = 'INSERT INTO expenses (description, amount, config_budget_id, user_id,month) VALUES (?, ?,?,?,?)';
    const values = [description, amount, config_budget_id,userId,month];
    
    db.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Error executing INSERT query:', error);
        res.status(500).json({ error: 'Internal Server Error' ,code: error.code });
      } else {
        console.log('Expense creation successfully');
        res.status(200).json({ message: 'Expense creation successfully' });
      }
      });
  });


app.get('/logout', (req, res) => {
  // Implement logout logic here
  console.log('hii');
  db.query(`SELECT * FROM users `, function(err, result){
    console.log(result);
    });

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
