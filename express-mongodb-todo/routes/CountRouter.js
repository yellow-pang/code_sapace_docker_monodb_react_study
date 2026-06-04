const express = require('express');
const router = express.Router();

var cnt = 0;
var responseData = {};
router.route("/").get(function(req, resp) {
    cnt++;
    var date = new Date();
    responseData = {
        "dateStr":date.getFullYear()+"-"+
            (date.getMonth()+1)+"-"+
            (date.getDate())+" "+
            (date.getHours())+":"+
            (date.getMinutes())+":"+
            (date.getSeconds()),
        "count":cnt
    }
    resp.end(JSON.stringify(responseData ) );
});

router.route("/:localCount").get( (req, res) => {
    if(cnt > Number(req.params.localCount) ) {
        console.log(req.params.localCount);
        res.end(JSON.stringify(responseData));
    } else {
        res.end("");
    }
});

module.exports = router;