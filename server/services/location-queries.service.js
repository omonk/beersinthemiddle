module.exports = (req, res) => {
    console.log(req.query);
    const queries = req.query; 
    console.log("------------------------");
    console.log("location hit");
    console.log(queries);
};