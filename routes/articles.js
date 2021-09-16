const express = require("express");
const article = require("./../models/article");
const Article = require("./../models/article");
const router = express.Router();

//to get new article data
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

//to get edit article data
router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

//to find single article by id
router.get("/:slug", async (req, res) => {
  //findById is mongoose method to find data by id
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

//to post data of new article
router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndredirect("new")
);

// to update data of article
router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next();
  },
  saveArticleAndredirect("edit")
);


//to delete article
router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndredirect(path) {
  return async (req, res) => {
    let article = req.article;

    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
