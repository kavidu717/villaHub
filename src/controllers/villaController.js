import Villa from "../models/villaModel.js";

export const createVilla=async(req,res)=>{
    
    try{
      const villaData={...req.body,user:req.user._id}
      const newVilla=new Villa(villaData)
      const  saveVilla=await newVilla.save()

      res.status(200).json({
        success:true,
        message:"villa created successfully",
        villa:saveVilla

      })
    }
    catch(error){
        res.status(500).
        json(
            {
                message:error.message
            }
        )
    }
}

export const getVillas=async(req,res)=>{
     const {city,featured,limit}=req.query
    try{
        const query={}
        if(city) query["location.city"]=city
        if(featured) query.featured=featured==="true"

        const villas=await Villa.find(query).limit(parseInt(limit) || 100)
        
        res.status(200).json({
            success:true,
            count:villas.length,
            data:villas
        })
    


    }catch(error){
        res.status(500).
        json(
            {
                message:error.message
            }
        )
    }
}

export const getVillaById=async(req,res)=>{
    try{
        const villa=await Villa.findById(req.params.id)
        if(!villa){
            return res.status(404).json({
                success:false,
                message:"villa not found"
            })
        }
        res.status(200).json({
            success:true,
            villa
        })
    }
    catch(error){
        res.status(500).
        json(
            {
                message:error.message
            }
        )
    }
    
}

export const updateVilla=async(req,res)=>{
    try{
        const updateVilla=await Villa.findByIdAndUpdate(req.params.id,
            {$set:req.body },
            {new:true,runValidators:true}

        )
        if(!updateVilla){
            return res.status(404).json({
                success:false,
                message:"villa not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"villa updated successfully",
            villa:updateVilla
        })
    }
    catch(error){
        res.status(500).
        json(
            {
                message:error.message
            }
        )
    }
}

export const deleteVilla=async(req,res)=>{
    try{
        const villa=await Villa.findById(req.params.id)
        if(!villa){
            return res.status(404).json({
                success:false,
                message:"villa not found"
            })
        }
        await villa.deleteOne()
        res.status(200).json({
            success:true,
            message:"villa deleted successfully"
        })

    }catch(error){
        res.status(500).
        json(
            {
                message:error.message
            }
        )
    }
}
