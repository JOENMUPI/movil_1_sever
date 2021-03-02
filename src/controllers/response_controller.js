const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesRes = require('../config/queries/response');
const dbQueriesSection = require('../config/queries/section');
const dbQueriesQuestion = require('../config/queries/question');
const dbQueriesInput = require('../config/queries/input');
const auth = require('../utilities/auth');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return { message, typeResponse, body }
}

const dataToResponse = (rows) => {
    const responses = [];
        
    rows.forEach(element => {
        responses.push({  
            response: element.response_form_des,
            id: element.response_form_ide,
        });
    });

    return responses;
}


// Logic
const createResponses = async (req, res) => {
    const { responses, userId, formId } = req.body;
    const check = await pool.query(dbQueriesRes.getResponseById, [ userId, responses[0].inputId ]);
    const client  = await pool.connect();

    if(!check) {
        res.json(newReponse('Error searching responses by user', 'Error', { }));
    
    } else {
        if(check.rowCount > 0) {
            res.json(newReponse('The user has already made this form.', 'Error', { }));
        } else {
            try {
                await client.query('BEGIN');
                responses.forEach( async (response)  => { 
                    const responseAux = [ response.data, new Date(), userId, response.inputId, formId ];
                    await client.query(dbQueriesRes.createResponse, responseAux);    
                });
                
                await client.query('COMMIT'); 
                res.json(newReponse('Responses created successfully', 'Success', { }));
        
            } catch(errors) { 
                await client.query('ROLLBACK');
                res.json(newReponse('Error on inserts responses', 'Fail', { errors }));
            
            } finally {
                client.release(); 
            }
        }
    }
}

const getDataByFormId = async (req, res) => {
    const { userId, formId } = req.params;
    const responses = [];

    if (await auth.AuthAdmin(userId)) {
        const allUsers = await pool.query(dbQueriesRes.getAllUsersResponse, [ formId ]);
        

        if(allUsers.rowCount <= 0) {

        } else {

        }



        const sectionData = await pool.query(dbQueriesSection.getSectionsByForm, [ formId ]);

        if(sectionData.rowCount <= 0) {
            res.json(newReponse('Sections not found', 'Error', { }));
        
        } else {
            sectionData.rows.forEach(async (section) => {
                const questionData = await pool.query(dbQueriesQuestion.getQuestionsBySection, [ section.section_form_ide ]);
                
                if(questionData.rowCount <= 0) {
                    res.json(newReponse('Questions not found', 'Error', { }));

                } else { 
                    questionData.rows.forEach(async (question) => {
                        const inputData = await pool.query(dbQueriesInput.getInputsByQuestion, [ question.question_ide ]);
                        
                        if(inputData.rowCount <= 0) {
                            res.json(newReponse('Inputs not found', 'Error', { }));
                        
                        } else {
                            inputData.rows.forEach(async (input) => {
                                const responseData = await pool.query(dbQueriesRes.checkResponseByInput, [ input ]);
                                if(responseData.rowCount > 0) {
                                    responses.push(dataToResponse(responseData.rows));
                                } 
                            });
                        }
                    });
                }
            });
        }
    
    } else {
        res.json(newReponse('user not admin', 'Error', { }));
    }
}

// Export
module.exports = {
   createResponses,
   getDataByFormId
}