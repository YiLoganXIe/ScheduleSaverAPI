async function searchCRNInField(client, m_CRN, m_field){
    try{
        console.log(`Searching for CRN: ${m_CRN} in Field ${m_field}`);
        results = await client.db("CourseVer1").collection(m_field).find({
            CRN: m_CRN
        }).toArray();
        results.forEach(result=>(console.log(result)));
        return await results;
    }
    catch(err){
        console.log(err);
    }
}

module.exports.searchCRNInField = searchCRNInField;