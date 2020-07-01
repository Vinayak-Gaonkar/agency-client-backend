const AgencyModel = require('../models/agency.model');
const ClientModel = require('../models/client.model');

exports.createAgency = async (req, res) => {
    try {
        let body = req.body, AgencyResult;
        console.log(req.body);

        let Clients = body.clients;
        delete body.clients;
        //find hieghest totalBill among the clients
        body.maxTotalBill = Math.max.apply(Math, Clients.map(function (o) { return o.totalBill; }))

        //check whether  agency already exist
        let isAgencyExist = await AgencyModel.findAgencyId(body.agencyId);
        console.log("isAgencyExist", isAgencyExist);

        if (isAgencyExist.length <= 0) {
            //create new client if not already exist
            AgencyResult = await AgencyModel.createAgency(body);
        } else if (body.maxTotalBill > isAgencyExist[0].maxTotalBill) {
            //update max total if an new client has maxBill 
            console.log("update max totalbill", body.maxTotalBill);
            await AgencyModel.updateMaxBill(isAgencyExist.agencyId, body.maxTotalBill)
        }

        let clientIds = Clients.map(ele => ele.clientId)
        //check wether clients aleady exist
        let isClientsExist = await ClientModel.listClietsByIds(clientIds);
        if (isClientsExist.length > 0) {
            throw Error(`clientIds are already exist`)
        } else {
            Clients = Clients.map(ele => {
                ele.agencyId = (AgencyResult && AgencyResult._id) ? AgencyResult.agencyId : isAgencyExist[0].agencyId
                return ele
            })
            //create clients in Client collection
            await ClientModel.createClients(Clients)
            console.log("Agency & clients created", AgencyResult);
            res.status(201).send({
                status: "success"
            })

        }


    } catch (error) {
        console.log(error);
        res.status(400).send({ reason: error.message })

    }

}

exports.updateClient = async (req, res) => {
    try {
        let body = req.body;
        let clientId = req.params.id;
        //get agency document by Id
        let isAgencyExist = await AgencyModel.findAgencyId(req.params.agencyId);

        let result = await ClientModel.updateClient(clientId, body)
        if (result.n) {
            let foundMax = await ClientModel.findMax(req.params.agencyId)
            //update the maxTotalBill if total bill is greter than existing
            console.log("isAgencyExist",isAgencyExist,foundMax);
            
            AgencyModel.updateMaxBill(req.params.agencyId, foundMax[0].totalBill)
            res.status(200).send({
                status: "success"
            })
        } else {
            throw Error("Unable to update " + req.params.id)
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ reason: error.message })
    }

}

exports.getAgency = async (req, res) => {
    let result = await AgencyModel.getAllAgency();
    // console.log(result);
    // return result;
    res.status(200).send({
        status: "success",
        payload: result
    })
}