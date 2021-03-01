const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesTypeInput = require('../config/queries/type_input');
const dbQueriesInput = require('../config/queries/input');
const dBQueriesForm = require('../config/queries/form');
const dbQueriesSection = require('../config/queries/section');
const dbQueriesQuestion = require('../config/queries/question');
const auth = require('../utilities/auth'); 

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToForm = (form, sections) => {
    return {  
        tittle: form.form_tit,
        id: form.form_ide,
        sections: sections
    }
}

const dataToSection = (section, questions) => {
    return {  
        tittle: section.section_form_tit,
        message: section.section_form_des,
        id: section.section_form_ide,
        questions: questions
    }
}

const dataToQuestion = (question, inputs) => {
    return { 
        obligatory: question.question_obl,
        tittle: question.question_tit,
        id: question.question_ide,
        inputs: inputs
    };
}

const dataToInput = (rows) => {
    const inputs = [];

    rows.forEach(element => {
        inputs.push({  
            message: element.input_form_txt,
            type: element.type_input_form_des,
            id: element.input_form_ide,
        });
    });

    return inputs;
}

const getInputsWithQuestion = async (question) => {
    const inputData = await pool.query(dbQueriesInput.getInputsByQuestion, [ question.id ]);
                     
    if(inputData.rowCount > 0) { 
        question.inputs = dataToInput(inputData.rows); 
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
const getQuestionById = async (req, res) => { 
    const { questionId } = req.params;
    const questionData = await pool.query(dbQueriesQuestion.getQuestionById, [ questionId ]);

    if(!questionData) {
        res.json(newReponse('Error searshing question', 'Error', { }));
    
    } else {
        if(questionData.rowCount <= 0) {
            res.json(newReponse('Question not found', 'Success', { }));
        
        } else {
            res.json(newReponse('Question found', 'Success', await getInputsWithQuestion(dataToQuestion(questionData.rows[0], []))));
        }
    }
}

const getSectionById = async (req, res) => {
    const { sectionId } = req.params;
    const sectionData = await pool.query(dbQueriesSection.getSectionById, [ sectionId ]);

    if(!sectionData) {
        res.json(newReponse('Error searshing section', 'Error', { }));
    
    } else {
        if(sectionData.rowCount <= 0) {
            res.json(newReponse('Section not found', 'Success', { }));
        
        } else {
            res.json(newReponse('Section found', 'Success', await getQuestionsWithSection(dataToSection(sectionData.rows[0], []))));
        }
    }
}

const getFormById = async (req, res) => {
    const { formId } = req.params;
    const formData = await pool.query(dBQueriesForm.getFormById, [ formId ]);

    if(!formData) {
        res.json(newReponse('Error searshing form', 'Error', { }));
    
    } else {
        if(formData.rowCount <= 0) {
            res.json(newReponse('Form not found', 'Success', { }));
        
        } else {
            res.json(newReponse('Form found', 'Success', await getSectionsWithForm(dataToForm(formData.rows[0], []))));
        }
    }
}

const getFormByMenuId = async (req, res) => {
    const { menuId } = req.params;
    const formData = await pool.query(dBQueriesForm.getFormByMenu, [ menuId ]);

    if(!formData) {
        res.json(newReponse('Error searshing form', 'Error', { }));
    
    } else {
        if(formData.rowCount <= 0) {
            res.json(newReponse('Form not found', 'Success', null));
        
        } else {
            res.json(newReponse('Form found', 'Success', dataToForm(formData.rows[0], [])));
        }
    }
}


const createForm = async (req, res) => {
    const { userId, menuId, form } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const formData = await client.query(dBQueriesForm.createForm, [ form.tittle, new Date(), userId, menuId ]);
        
        form.sections.forEach(async (section) => { 
            const sectionAux = [ section.tittle, section.message, formData.rows[0].form_ide ];
            const sectionData = await client.query(dbQueriesSection.createSection, sectionAux);
            
            section.questions.forEach(async (question) => { 
                const questionAux = [ question.tittle, question.obligatory, sectionData.rows[0].section_form_ide ];
                const questionData = await client.query(dbQueriesQuestion.createQuestion, questionAux);

                question.inputs.forEach(async (input) => { 
                    const typeInputId = await pool.query(dbQueriesTypeInput.getTypeInputByDescription, [ input.type ]);
                                    
                    if(typeInputId) { 
                        const inputAux = [ input.message, typeInputId.rows[0].type_input_form_ide, questionData.rows[0].question_ide ];
                        
                        await pool.query(dbQueriesInput.createInput, inputAux);

                    } else { 
                        res.json(newReponse('Error searching TI id', 'Error', { }));        
                    }
                });
            });
        });

        await client.query('COMMIT');
        res.json(newReponse('Form created successfully', 'Success', { }));

    } catch(errors) {
        await client.query('ROLLBACK');
        res.json(newReponse('Error on inserts', 'Fail', { errors }));

    } finally { 
        client.release();
    }
}

const deleteFormById = async (req, res) => {
    const { formId, userId } = req.params;
    
    if(await auth.AuthAdmin(userId)) {
        const formData = await pool.query(dBQueriesForm.deleteFormById, [ formId ]);
        
        if(formData) {
            res.json(newReponse('Form deleted successfully', 'Error', { }));    
        } 

    } else {
        res.json(newReponse('User not admin', 'Error', { }));
    }
}


// Export
module.exports = {
    createForm,
    getFormById,
    getFormByMenuId,
    getQuestionById,
    getSectionById,
    deleteFormById,
}