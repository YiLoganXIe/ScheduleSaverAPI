async function searchInstructor(client, m_instructor, m_field){
    if(m_field!=0){
        try{
            console.log(`Searching for Courses issue by: ${m_instructor} in field ${m_field}`);
            collectionList = await client.db("CourseVer1").listCollections().toArray();
            results = await client.db("CourseVer1").collection(m_field).find({
                Instructor: new RegExp(m_instructor)
            }).toArray();
            if(results.length>0){
                results.forEach(result=>(console.log(result)));
                return await results;
            }
        } catch(err){
            console.log(err);
        }
    }
    else{
        try{
            console.log(`Searching for Courses issue by: ${m_instructor}`);
            collectionList = await client.db("CourseVer1").listCollections().toArray();
            let courses = [];
            for(let i = 0; i < collectionList.length; i++){
                results = await client.db("CourseVer1").collection(collectionList[i].name).find({
                    Instructor: new RegExp(m_instructor)
                }).toArray();
                if(results.length>0){
                    results.forEach(result=>{
                        console.log(result);
                        courses.push(result);
                    });
                }
            }
            return await courses;
        } catch(err){
            console.log(err);
        }
    }
}

module.exports.searchInstructor = searchInstructor;
