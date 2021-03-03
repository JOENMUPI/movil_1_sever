const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesRes = require('../config/queries/response');
const dbQueriesSection = require('../config/queries/section');
const dbQueriesQuestion = require('../config/queries/question');
const dbQueriesInput = require('../config/queries/input');
const dbQueriesForm = require('../config/queries/form');
const auth = require('../utilities/auth');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return { message, typeResponse, body }
}

const dataToForm = (form, sections) => {
    return {  
        tittle: form.form_tit,
        id: form.form_ide,
        sections
    }
}

const dataToSection = (section, questions) => {
    return {  
        tittle: section.section_form_tit,
        message: section.section_form_des,
        id: section.section_form_ide,
        questions
    }
}

const dataToQuestion = (question, inputs) => {
    return { 
        obligatory: question.question_obl,
        tittle: question.question_tit,
        type: question.type_input_form_des,
        id: question.question_ide,
        inputs
    };
}

const dataToInput = (input, responses) => {
    return {
        message: input.input_form_txt,
        id: input.input_form_ide,
        responses
    }
}

const dataToResponse = (rows) => {
    const responses = [];
        
    rows.forEach(element => {
        responses.push({  
            response: element.response_form_jso.response,
        });
    });

    return responses;
}

const getReponsesWithinput = async (input) => {
    const responseData = await pool.query(dbQueriesRes.checkResponseByInput, [ input.id ]);
            
    if(responseData.rowCount > 0) { 
        input.responses = await dataToResponse(responseData.rows);
        return input; 
    
    } else {
        return null;
    }
}

const getInputsWithQuestion = async (question) => {
    const inputData = await pool.query(dbQueriesInput.getInputsByQuestion, [ question.id ]);
    const inputs = [];

    if(inputData.rowCount > 0) {
        for(let i = 0; i < inputData.rowCount; i++) { 
            inputs.push(await getReponsesWithinput(dataToInput(inputData.rows[i], [])));
        } 
        
        question.inputs = inputs; 
        return question;

    } else {
       return null; 
    }
}

const getQuestionsWithSection = async (section) => {
    const questionData = await pool.query(dbQueriesQuestion.getQuestionsBySection, [ section.id ]);
    const questions = [];

    if(questionData.rowCount > 0) { 
        for(let i = 0; i < questionData.rowCount; i++) { 
            questions.push(await getInputsWithQuestion(dataToQuestion(questionData.rows[i], [])));
        } 
        
        section.questions = questions; 
        return section;
    
    } else {
        return null;
    }
}

const getSectionsWithForm = async (form) => {
    const sectionData = await pool.query(dbQueriesSection.getSectionsByForm, [ form.id ]);
    const sections = [];

    if(sectionData.rowCount > 0) {
        for(let i = 0; i < sectionData.rowCount; i++) {
            sections.push(await getQuestionsWithSection(dataToSection(sectionData.rows[i], [])));
        }

        form.sections = sections;
        return form;

    } else {
        return null;
    }
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
    let response = { userNum: 0, form: null };

    if (await auth.AuthAdmin(userId)) {
        const allUsers = await pool.query(dbQueriesRes.getAllUsersResponse, [ formId ]);
        const formData = await pool.query(dbQueriesForm.getFormById, [ formId ]);

        if(allUsers.rowCount <= 0) {
            res.json(newReponse('This form not have responses', 'Error', { }));
        
        } else { 
            response.userNum = allUsers.rows[0].count;

            if(!formData) {
                res.json(newReponse('Error searshing form', 'Error', { }));
            
            } else {
                if(formData.rowCount <= 0) {
                    res.json(newReponse('Form not found', 'Success', { }));
                
                } else {
                    response.form = await getSectionsWithForm(dataToForm(formData.rows[0], [])); 
                    res.json(newReponse('Form found', 'Success', response));
                }
            }
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