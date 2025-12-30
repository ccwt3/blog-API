export default {
  getPosts
}

async function getPosts(req: any, res: any) {
  return res.status(200).json({message: "get posts"})
}