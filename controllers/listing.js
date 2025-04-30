const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  }

  module.exports.renderNewform=(req, res) => {
    res.render("listing/new.ejs");
  };

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","The listing you are trying to access does not exists");
      res.redirect("/listing");
    }

    res.render("listing/show.ejs", { listing});
  }

  module.exports.createListing=async (req, res) => {

   let response= await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
      .send()

    let url=req.file.path;
    let filename=req.file.filename;
    let newListing = await new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    
   newListing.geometry=response.body.features[0].geometry;

    let savedlisting=await newListing.save();
   // console.log(savedlisting);
    req.flash("success","New listing Created");
    res.redirect("/listing");
    
  }

  module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","The listing you are trying to access does not exists");
      res.redirect("/listing");
    }

    let originalurl=listing.image.url;
    originalurl= originalurl.replace("/upload","/upload/h_300,w_250")
    res.render("listing/edit.ejs", { listing ,originalurl});
  }

  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }

    req.flash("success"," Listing Updated");
    res.redirect(`/listing/${id}`);
  }

  module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing Deleted");
    res.redirect("/listing");
  }