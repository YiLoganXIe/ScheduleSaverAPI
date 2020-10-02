const { searchCRNOnly } = require("./search-crn-only");
const { searchCRNInField } = require("./search-crn-in-field");
const { searchCourse } = require("./search-course");
const { searchInstructor } = require("./search-Instructor");
const { searchCourseInField } = require("./search-field");


async function findCourse(client, m_field, m_course, m_CRN, m_instructor){
    if(m_CRN!=0&&m_course==0&&m_field==0&&m_instructor==0){
        return await searchCRNOnly(client, m_CRN);
    } else if(m_field!=0&&m_CRN!=0){
        return await searchCRNInField(client, m_CRN, m_field);
    } else if(m_course!=0){
        return await searchCourse(client, m_course);
    } else if(m_instructor!=0){
        return await searchInstructor(client, m_instructor, m_field);
    } else if(m_field!=0){
        return await searchCourseInField(client, m_field);
    }
}

async function CoursesearchController(client, m_field,m_course, m_CRN, m_instructor){
    try{
        await client.connect();
        result = await findCourse(client, m_field, m_course, m_CRN, m_instructor);
    } catch(err){
        console.error(err);
    } finally {
        return result;
    }
}


module.exports.CoursesearchController = CoursesearchController;