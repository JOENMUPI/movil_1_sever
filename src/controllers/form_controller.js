const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesTypeInput = require('../config/queries/type_input');
const dbQueriesInput = require('../config/queries/input');
const dBQueriesForm = require('../config/queries/form');
const dbQueriesSection = require('../config/queries/section');
const dbQueriesQuestion = require('../config/queries/question');
const auth = require('../utilities/auth');
const field = require('../utilities/field');

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

const checkForm = (form) => {
    let flag = true;
    
    try {
        if(!field.checkFields([ form.tittle, form.sections ])) { 
            flag = false;
        
        } else {
            form.sections.forEach(section  => { 
                if(!field.checkFields([ section.tittle, section.message, section.questions ])) {
                    flag = false;
                
                } else {
                    section.questions.forEach(question => { 
                        if(!field.checkFields([ question.tittle, question.inputs, question.obligatory ])) {
                            flag = false;
                        
                        } else {
                            question.inputs.forEach(input => { 
                                if(!field.checkFields([ input.message, input.type ])) {
                                    flag = false;      
                                } 
                            });
                        }
                    });
                }    
            });
        }

        return flag;

    } catch (err) { 
        return false;
    }
}


// Logic
const getFormById = async (req, res) => {
    const { formId } = req.params;
    const formData = await pool.query(dBQueriesForm.getFormById, [ formId ]);
    let questions = [];
    let sections = [];

    if(!formData) {
        res.json(newReponse('Error searshing form', 'Error', { }));

    } else {
        if(formData.rowCount <= 0) {
            res.json(newReponse('Form not found', 'Success', { }));    
        
        } else { 
            const sectionData = await pool.query(dbQueriesSection.getSectionsByForm, [ formData.rows[0].form_ide ]); 
            
            if(!sectionData) {
                res.json(newReponse('Error searshing sections', 'Error', { }));
            
            } else {
                if(sectionData.rowCount <= 0) { 
                    res.json(newReponse('Section not found', 'Success', { }));
                
                }   else {
                    for(let i = 0; i < sectionData.rowCount; i++) {
                        const sectionId = [ sectionData.rows[i].section_form_ide ];
                        const questionData = await pool.query(dbQueriesQuestion.getQuestionsBySection, sectionId);

                        if(!questionData) {
                            res.json(newReponse('Error searshing questions', 'Error', { }));
                        } else {
                            if(questionData.rowCount <= 0) { 
                                res.json(newReponse('Section not found', 'Success', { }));
                            } else {
                                
                                for(let j = 0; j < questionData.rowCount; j++) {
                                    const questionId = [ questionData.rows[j].question_ide ];
                                    const inputData = await pool.query(dbQueriesInput.getInputsByQuestion, questionId);
                                
                                    if(!inputData) {
                                        res.json(newReponse('Error searshing inputs', 'Error', { }));
                                    
                                    } else {
                                        if(inputData.rowCount <= 0) {
                                            res.json(newReponse('Inputs not found', 'Success', { }));
                                        
                                        } else { 
                                            questions.push(dataToQuestion(questionData.rows[j], dataToInput(inputData.rows)));
                                        }
                                    }
                                }

                                sections.push(dataToSection(sectionData.rows[i], questions));
                            } 
                        }
                    }
                }
            }
            
            res.json(newReponse('funca', 'Success', dataToForm(formData.rows[0], sections)));
        }
    }
}

const createForm = async (req, res) => {
    const { userId, menuId } = req.params;
    const form = req.body;
    const errors = [];
    
    if(!checkForm(form)) {
        errors.push({ text: 'Invalid format' });
    } 
    
    if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'Fail', { errors }));
    
    } else {
        if(await auth.AuthAdmin(userId)) {
            const formData = await pool.query(dBQueriesForm.createForm, [ form.tittle, new Date(), userId, menuId ]);
            
            if(!formData) { 
                res.json(newReponse('Error create form', 'Error', { }));
    
            } else { 
                form.sections.forEach(async (section) => {
                    const sectionAux = [ section.tittle, section.message, formData.rows[0].form_ide ];
                    const sectionData = await pool.query(dbQueriesSection.createSection, sectionAux);
                
    
                    if(!sectionData) {
                        res.json(newReponse('Error create section', 'Error', { }));
                    
                    } else { 
                        section.questions.forEach( async (question) => {
                            const questionAux = [ question.tittle, question.obligatory, sectionData.rows[0].section_form_ide ];
                            const questionData = await pool.query(dbQueriesQuestion.createQuestion, questionAux);
    
    
                            if(!questionData) { 
                                res.json(newReponse('Error create question', 'Error', { }));
                            
                            } else { 
                                question.inputs.forEach(async (input) => { 
                                    const typeInputId = await pool.query(dbQueriesTypeInput.getTypeInputByDescription, [ input.type ]);
                                    
                                    if(typeInputId) { 
                                        const inputAux = [ 
                                            input.message, 
                                            typeInputId.rows[0].type_input_form_ide, 
                                            questionData.rows[0].question_ide 
                                        ];
                                        
                                        await pool.query(dbQueriesInput.createInput, inputAux);
    
                                    } else { 
                                        res.json(newReponse('Error searching TI id', 'Error', { }));        
                                    }   
                                });
                            }
                        });
                    }
                });
    
                res.json(newReponse('Form created successfully', 'Success', { }));
            }
    
        } else {
            res.json(newReponse('User not admin', 'Error', { }));
        }
    }
}


// Export
module.exports = {
    createForm,
    getFormById
}