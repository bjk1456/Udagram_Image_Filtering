import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
const urlExists = require('url-exists');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req, res ) => {
    urlExists(req.query.image_url, function(err: any, exists:any) {
      if((!exists) || (err)){
        res.status(404).send({message : 'Failed to obtain an image from the' + req.query.image_url + 'image_url'})
      }
    });
    filterImageFromURL(req.query.image_url).then(path => {
      res.sendFile(path, function (err: any, data: any){
        if(err)  res.status(404).send({message : 'Failed to send cropped image from the' + req.query.image_url + 'image_url because: ' + err.message});
        deleteLocalFiles([path]);
      });
    }).catch(err => res.status(404).send({message : 'Failed to crop the image from the' + req.query.image_url + 'image_url'}));
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();