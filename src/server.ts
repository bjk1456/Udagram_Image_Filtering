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
    console.log("Inside GET /filteredimage");
    urlExists(req.query.image_url, function(err, exists) {
      console.log(exists); // true
      console.log(err);
      if((!exists) || (err)){
        res.status(404).send({message : 'Failed to obtain an image from the' + req.query.image_url + 'image_url'})
      }
    });
    filterImageFromURL(req.query.image_url).then(path => {
      console.log(path);
      res.sendFile(path, function (err, data){
        if(err) return console.error(err);
        let files: string[] = [path];
        deleteLocalFiles(files);

      });
      console.log("Inside the big one the path is " + path);
      //let files: string[] = [path];
      //deleteLocalFiles(files);
    }).catch(err => res.status(404).send({message : 'Failed to crop the image from the' + req.query.image_url + 'image_url'}));

    console.log("Sup dawg?");
    //let files: string[] = ["/Users/benjaminkelly/Udacity/CloudDeveloperNANO/Udagram_Image_Filtering/src/util/tmp/filtered.928.jpg"]
    //deleteLocalFiles(files);
    //res.send("destToFile: ");

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