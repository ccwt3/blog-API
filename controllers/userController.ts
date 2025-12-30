export default {
  getUsers
}

async function getUsers(req: any, res: any) {
  return res.status(200).json({message: "get users"})  
}