import mongoose  from "mongoose";

const villaSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    location:{
        city:{type:String,required:true},
        address:{type:String,required:true},
        mapCoords:{type:String}
    },
    description:{
        type:String,
        required:true
    },
    maxGuests:{
        type:Number,
        required:true
    },
    bedrooms:{
        type:Number,
        required:true
    },
    bathrooms:{
        type:Number,
        required:true
    },
    amenties:{
        hasPool:{type:Boolean,default:false},
        hasWifi:{type:Boolean,default:true},
        hasKitchen:{type:Boolean,default:true},
        hasAC:{type:Boolean,default:false},
        hasparking:{type:Boolean,default:false},
        isPetFriendly:{type:Boolean,default:false}
        
    },
    photos:{
        url:{type:String},
        public_id:{type:String}

    },
    pricePerNight:{
        type:Number,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    reviews:[
        {
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            rating:{type:Number,required:true},
            comment:{type:String,required:true}
        }
    ]

},
    {timestamps:true})












export default mongoose.model("Villa",villaSchema)