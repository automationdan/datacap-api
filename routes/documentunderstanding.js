const express = require('express');
var datacap = require('../datacap/datacap');

const multer = require('multer');
const router = express.Router();
const fileUpload = require('express-fileupload');


router.post('/captureDocument/:pageType/:application/:workflow/:rules/:ext',(req,res)=>{
  //  datacap.beginTransaction().then(data => {console.log(data)});
  let transId = ""

  let fileToProcess = req.files.uploadFile
  let rules = req.params.rules
  let workflow = req.params.workflow
  let application = req.params.application
  let ext = req.params.ext
  let pageType = req.params.pageType
  console.log(ext);
  console.log(rules)
//  datacap.setDatacapWtm('158.175.103.101','80');

  datacap.beginDataCapTransaction()
    .then(data => {
      transId = data;
      console.log("About to start batch")
      datacap.uploadBatchFile(transId,fileToProcess,pageType)
      .then(data => {
        datacap.UploadPageFile(transId)
        .then(data =>{
          datacap.uploadDocumentForProcessing(transId,fileToProcess)
          .then(data =>{
              datacap.executeRules(transId,application,workflow,rules).then(data=>{
                  datacap.fetchDataFile(transId,ext).then(data=>{
                    datacap.convertToText(data).then(data =>{
                      //let obj = JSON.parse(data);
                      rtnValue = {"transactionalId": transId, values: data}
                      res.send(rtnValue)
                    })

                  })
              })
          })

        })
        .catch(err => {res.send("error in page" + err)})
      })
      .catch(err => {res.send("error in batch")})
    })
    .catch(() => {
      console.error('Begin transaction');
    })
})

router.post('/executeRules/:transactionalId/:application/:workflow/:rules/:ext',(req,res)=>{
  //  datacap.beginTransaction().then(data => {console.log(data)});

  let rules = req.params.rules
  let workflow = req.params.workflow
  let application = req.params.application
  let ext = req.params.ext
  let transactionalId = req.params.transactionalId
  console.log(ext);
  console.log(rules)
  datacap.executeRules(transactionalId,application,workflow,rules).then(data=>{
      datacap.fetchDataFile(transactionalId,ext).then(data=>{
        datacap.convertToText(data).then(data =>{
          //let obj = JSON.parse(data);
          rtnValue = {"transactionalId": transactionalId, values: data}
          res.send(rtnValue)
        })

      })
  })

})


router.post('/uploadAndPrepare/:pageType',(req,res) =>{
  let fileToProcess = req.files.uploadFile
  let pageType = req.params.pageType
  datacap.beginDataCapTransaction()
    .then(data => {
      transId = data;
      console.log("About to start batch")
      datacap.uploadBatchFile(transId,fileToProcess,pageType)
      .then(data => {
        datacap.UploadPageFile(transId)
        .then(data =>{
          datacap.uploadDocumentForProcessing(transId,fileToProcess)
          .then(data =>{
            rtnValue = {"transactionalId": transId}
            res.send(rtnValue);
          })
        })
        .catch(err => {res.send("error in page" + err)})
      })
      .catch(err => {res.send("error in batch")})
    })
    .catch(() => {
      console.error('Begin transaction');
    })
  })

  router.get('/getdocFile/:transactionalId/:ext',(req,res) =>{
    let ext = req.params.ext
    let transactionalId = req.params.transactionalId
    //datacap.fetchDataNotPromiseFile(transactionalId,ext,res)
    datacap.fetchDataFile(transactionalId,ext).then(data=>{
      //res.setHeader('content-type', 'application/pdf');
      //res.setHeader('Content-Length', stat.size);

      //res.setHeader('Content-Type', 'application/pdf');
      //res.setHeader('Content-Disposition', 'attachment; filename=tm000001.pdf');
      res.send(data)

    })
  });

router.get('/getdoc/:transactionalId/:ext',(req,res) =>{
  let ext = req.params.ext
  let transactionalId = req.params.transactionalId
  datacap.fetchDataFilePipe(transactionalId,ext,res);
  /*datacap.fetchDataFile(transactionalId,ext).then(data=>{
    //res.setHeader('content-type', 'application/pdf');
    //res.setHeader('Content-Length', stat.size);

    //res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; filename=tm000001.pdf');
    //res.send(data)
    console.log(data.headers)
    //res.setHeader('content-disposition', data.headers['content-disposition']);
    res.setHeader('Content-type', data.headers['content-type']);
    data.pipe(res);
  })*/
});

router.post('/upload', (req, res) => {
  res.send({upoadedOk: true})
});


router.get('/test', (req, res) => {
  res.send({upoadedOk: true})
});




module.exports = router;
