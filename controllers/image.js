//* REST API
const Clarifai = require('clarifai');
// console.log(Clarifai)

const app = new Clarifai.App({
    apiKey: 'b58172beddae4925b565b284608ad97d'
});

//* gRPC
// const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

// const stub = ClarifaiStub.grpc();

// const metadata = new grpc.Metadata();
// metadata.set("authorization", "Key b58172beddae4925b565b284608ad97d");

const handleApiCall = (req, res) => {
    //* gRPC  
    // stub.PostModelOutputs(
    //     {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
    //         model_id: "age-demographics-recognition",
    //         inputs: [
    //             { data: { image: { url: req.body.input } } }
    //         ]
    //     },
    //     metadata,
    //     (err, response) => {
    //         if (err) {
    //             throw new Error(err);
    //         }

    //         if (response.status.code !== 10000) {
    //             throw new Error("Post model outputs failed, status: " + response.status.description);
    //         }

            // Since we have one input, one output will exist here.
    //         const output = response.outputs[0];

    //         console.log("Predicted concepts:");
    //         for (const concept of output.data.concepts) {
    //             console.log(concept.name + " " + concept.value);
    //         }
    //         res.json(response)
    //     }
    // );
    //* REST
    app.models  // Security review 12:06
        .predict("age-demographics-recognition", req.body.imageFileUrl) // this.state.imageUrl cannot work here because of how this.setState works.
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'));
}

module.exports = {
    handleApiCall
}