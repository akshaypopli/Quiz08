const express = require ('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const {check, body, validationResult } = require('express-validator');

const options = {
    swaggerDefinition: {
      info: {
        title: "Personal Budget API",
        version: "1.0.0",
        description: "Personal Budget API autogenerated by Swagger",
      },
      host: "localhost:3000",
      basePath: "/",
    },
    apis: ["./server.js"],
};

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

const mariadb = require ('mariadb');
const pool = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sample',
        port: 3306,
        connectionLimit: 5
});

/**
 * @swagger
 * /customers:
 *    get:
 *      description: Return all customers
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object containing array of customers
 */
app.get('/customers', (req, res)=>{
    pool.getConnection()
    .then(con =>{
            // sql query
            con.query("SELECT customer.CUST_CODE, customer.CUST_NAME from customer")
            .then((data)=>{
                // Header
                res.header('Content-Type', 'application/json');
                // JSON response
                res.json(data);
                con.end();
            })
            .catch(err =>{
                // print the error
                console.log(err);
                // close the connection
                con.end();
            });
    }).catch(err=>{
            console.log(err);
    });

});

/**
 * @swagger
 * /customer/{customer_id}:
 *    get:
 *      description: Return customer with CUST_CODE = {customer_id}
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object containing details of customer with CUST_CODE = {customer_id}
 */
app.get('/customer/:customer_id', (req, res)=>{
    pool.getConnection()
    .then(con =>{
    // sql query
        con.query("SELECT * from customer WHERE CUST_CODE='"+[req.params.customer_id]+"'")
        .then((data)=>{
            // Header
            res.header('Content-Type', 'application/json');
            // JSON response
            res.json(data);
            con.end();
        })
        .catch(err =>{
            // print the error
            console.log(err);
            // close the connection
            con.end();
        });
    }).catch(err=>{
        console.log(err);
    });
});

/**
 * @swagger
 * /student-report:
 *    get:
 *      description: Return student report containing Name, Class, Grade, RollID, Section
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object containing array of students
 */
app.get('/student-report', (req, res)=>{
    pool.getConnection()
    .then(con =>{
            // sql query
            con.query("SELECT student.NAME, student.TITLE, student.CLASS, studentreport.GRADE FROM student INNER JOIN studentreport ON student.ROLLID=studentreport.ROLLID and student.SECTION=studentreport.SECTION")
            .then((data)=>{
                // Header
                res.header('Content-Type', 'application/json');
                // JSON response
                res.json(data);
                con.end();
            })
            .catch(err =>{
                // print the error
                console.log(err);
                // close the connection
                con.end();
            });
    }).catch(err=>{
            console.log(err);
    });
}); 

/**
 * @swagger
 * /agents:
 *    get:
 *      description: Return all agents
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object containing array of agents
 */                                                                                                                                                                                                         app.get('/agents', (req, res)=>{
    pool.getConnection()
    .then(con =>{
            // sql query
            con.query("SELECT AGENT_NAME, WORKING_AREA, PHONE_NO FROM agents")
            .then((data)=>{
                // Header
                res.header('Content-Type', 'application/json');
                // JSON response
                res.json(data);
                con.end();
            })
            .catch(err =>{
                // print the error
                console.log(err);
                // close the connection
                con.end();
            });
    }).catch(err=>{
            console.log(err);
    });
});

/**
 * @swagger
 * /company:
 *    get:
 *      description: Return all company
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object containing array of company
 */
app.get('/company', (req, res)=>{
    pool.getConnection()
    .then(con =>{
            // sql query
            // INSERT INTO table_name (column1, column2, column3, ...)
            // VALUES (value1, value2, value3, ...);
            con.query("SELECT * FROM company")
            .then((data)=>{
                // Header
                res.header('Content-Type', 'application/json');
                // JSON response
                res.json(data);
                con.end();
            })
            .catch(err =>{
                // print the error
                console.log(err);
                // close the connection
                con.end();
            });
    }).catch(err=>{
            console.log(err);
    });
});

/**
 * @swagger
 * /items:
 *    get:
 *      description: Return all listofitem
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object containing array of listofitem
 */
app.get('/items', (req, res)=>{
    pool.getConnection()
    .then(con =>{
            // sql query
            con.query("SELECT * from listofitem")
            .then((data)=>{
                // Header
                res.header('Content-Type', 'application/json');
                // JSON response
                res.json(data);
                con.end();
            })
            .catch(err =>{
                // print the error
                console.log(err);
                // close the connection
                con.end();
            });
    }).catch(err=>{
            console.log(err);
    });
});

/**
 * @swagger
 * /delete-customer/{customer_id}:
 *    delete:
 *      description: delete record from customer table
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: deleted data from customer table
 *          500:
 *              description: Data does not exist
 */
app.delete('/delete-customer/:customer_id',[
        check('customer_id').trim().not().isEmpty().withMessage('id should not be empty').isLength({max:6}).withMessage("Id should have maximum 6 numbers")
    ], (req, res)=>{

        var errors= validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }else {
        pool.getConnection()
        .then(con =>{
                // sql query
                con.query("SELECT * from customer WHERE CUST_CODE='"+[req.params.customer_id]+"'")
                .then((d)=>{
                    if(d.length==0){
                        res.header("Content-Type", "application/json");
                        res.status(500).send({error:"Data does not exists"});
                        con.close();
                        return;
                    }
                    con.query("DELETE from customer WHERE CUST_CODE='"+[req.params.customer_id]+"'")
                        .then(()=>{
                        res.send("delete successfully");
                        con.end();
                    })
                })
            .catch(err =>{
                    // print the error
                    console.log(err);
                    // close the connection
                    con.end();
                });
        }).catch(err=>{
                console.log(err);
        });
    }
});

/**
 * @swagger
 * /company/{company_id}/{company_name}:
 *    patch:
 *      description: Update name of company for a given company ID
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Patched data to company table
 */
app.patch('/company/:company_id/:company_name', (req, res)=>{
    pool.getConnection()
    .then(con =>{
            // sql query
             con.query("SELECT * from company WHERE COMPANY_ID='"+[req.params.company_id]+"'").then((d)=>{
               console.log(d);
                if(d.length == 0){
                  res.status(500).send({error:"No Such Company Exists"});
                  con.close();
                  return;
                }else{
                  con.query("UPDATE company SET COMPANY_NAME='"+[req.params.company_name]+"' WHERE COMPANY_ID='"+[req.params.company_id]+"'")
                  .then(()=>{
                     // Header
                     // res.header('Content-Type', 'application/json');
                     // JSON response
                  res.send("update company name  successfully");
                  con.end();
                })
              }
           })
           .catch(err =>{
                // print the error
                console.log(err);
                // close the connection
                con.end();
            });
    }).catch(err=>{
            console.log(err);
    });
});

/**
 * @swagger
 * definitions:
 *   company:
 *     properties:
 *       company_id:
 *         type: string
 *       company_name:
 *         type: string
 *       company_city:
 *         type: string
 */
/**
 * @swagger
 * /add-company:
 *    post:
 *      description: add record to company table
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Added data to company table
 *          500:
 *              description: Data already exists
 *
 */
app.post('/add-company', (req, res)=>{
    pool.getConnection()
    .then(con =>{
            // sql query
             con.query("SELECT * from company WHERE COMPANY_ID='"+[req.body.company_id]+"'")
            .then((d)=>{
                if(d.length>0){
                    res.header("Content-Type", "application/json");
                    res.status(500).send({error:"Data already exists"});
                    con.close();
                    return;
                }
                con.query("INSERT INTO company (COMPANY_ID, COMPANY_NAME, COMPANY_CITY) VALUES ('"+[req.body.company_id]+"', '"+[req.body.company_name]+"', '"+[req.body.company_city]+"')")
                .then((data)=>{
                    res.header("Content-Type", "application/json");
                    res.status(200);
                    res.send(data);
                    con.close();;
                })
            })
    }).catch(err=>{
            console.log(err);
    });
});

/**
 * @swagger
 * /item/{item_id}:
 *    put:
 *      description: add record to listofitem table
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description:  data put to listofitem table
 *          500:
 *              description: Data already exists
 */
app.put('/item/:item_id', (req, res)=>{
    pool.getConnection()
    .then(con =>{
            // sql query
            con.query("SELECT * from listofitem WHERE ITEMCODE='"+[req.params.item_id]+"'").then((d)=>{
                console.log(d);
                if(d.length != 0){
                  con.query("UPDATE listofitem SET ITEMNAME='"+[req.body.item_name]+"', BATCHCODE='"+[req.body.item_batch_code]+"', CONAME='"+[req.body.item_coname]+"' WHERE ITEMCODE='"+[req.params.item_id]+"'")
                  .then((data) => {
                    res.header("Content-Type", "application/json");
                    res.status(200);
                    res.send(data);
                    con.close();
                  })
                  return;
                }else {
                    con.query("INSERT INTO listofitem (ITEMCODE, ITEMNAME, BATCHCODE, CONAME) VALUES ('"+[req.body.item_id]+"', '"+[req.body.item_name]+"', '"+[req.body.item_batch_code]+"', '"+[req.body.item_coname]+"')")
                    .then((data) => {
                        res.header("Content-Type", "application/json");
                        res.status(200);
                        res.send(data);
                        con.close();
                      })
                      .catch((err) => {
                        console.log(err);
                        con.end();
                      });
                    return;
                }
            })
    }).catch(err=>{
            console.log(err);
    });
});

app.listen(port, ()=>{                                                                                                                                                                                       
    console.log(`Example app listening to http://localhost:${port}`)
});