async function searchCourseInField(client, m_field){
    try{
        console.log(`Searching for courses in field: ${m_field}...`);
        results = await client.db("CourseVer1").collection(m_field).find().toArray();
        results.forEach(result=>(console.log(result)));
        return await results;
    }
    catch(err){
        console.log(err);
    }
}

module.exports.searchCourseInField = searchCourseInField;