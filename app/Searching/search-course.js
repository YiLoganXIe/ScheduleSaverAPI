async function searchCourse(client, m_course){
    try{
        console.log(`Searching for course: ${m_course} in field ${m_course.substring(0,3)}...`);
        results = await client.db("CourseVer1").collection(m_course.substring(0,3)).find({
            Course: new RegExp(m_course)
        }).toArray();
        results.forEach(result=>(console.log(result)));
        return await results;
    }
    catch(err){
        console.log(err);
    }
}

module.exports.searchCourse = searchCourse;