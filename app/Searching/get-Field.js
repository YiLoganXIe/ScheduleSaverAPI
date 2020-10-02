async function getFields(client){
    try{
        await client.connect();
        console.log(`Getting Fields from Database...`);
        collectionList = await client.db("CourseVer1").listCollections().toArray();
    } catch(err){
        console.error(err);
    } finally {
        return await collectionList;
    }
}

module.exports.getFields = getFields;