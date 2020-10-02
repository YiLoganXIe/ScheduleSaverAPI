async function searchCRNOnly(client, m_CRN){
    try{
        console.log(`Searching for CRN: ${m_CRN}`);
        collectionList = await client.db("CourseVer1").listCollections().toArray();
        for(let i = 0; i < collectionList.length; i++){
            results = await client.db("CourseVer1").collection(collectionList[i].name).find({
                CRN: m_CRN
            }).toArray();
            if(results.length>0){
                results.forEach(result=>(console.log(result)));
                return await results;
            }
        }
    } catch(err){
        console.log(err);
    }
}

module.exports.searchCRNOnly = searchCRNOnly;