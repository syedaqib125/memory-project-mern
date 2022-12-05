import Posts from "../models/postModel.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; //get the starting index of every page (1-1)*8=0
    const total = await Posts.countDocuments({}); //count of how many documents/posts do we have
    //sort({_id:-1}) this is going to give us the newest posts first
    //skpi(startIndex) skip all the previous pages,
    //if you are on the page 2 ypu dont want to fetch first 16 posts again
    //you want to skip first eight
    //we are going  to skip all the way the start index
    const posts = await Posts.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    }); //ceil(95/10)=9.5 after ceil it will be 10 pages
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//QUERY -> /posts?page=1 -> page = 1
//PARAMS -> /posts/123-> id = 123

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query; //after route name change it will work but dont know how
  try {
    const title = new RegExp(searchQuery, "i"); // i, returns all the data on that title no matter how it is written (test,Test,TEST)
    const posts = await Posts.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
      //find me all the posts that match one those two criteria title and second one
      //is one of the tags in the array of tagsis equal to our tags
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new Posts({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  const updatedPost = await Posts.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  await Posts.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthorized" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  const post = await Posts.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(String(req.userId));
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await Posts.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};
// module.exports = { getPosts }
