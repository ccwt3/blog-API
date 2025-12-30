export default {
  getAuth
}

async function getAuth(req: any, res: any) {
  return res.status(200).json({message: "get Auth"})
}