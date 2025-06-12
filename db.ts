import { PrismaClient } from './generated/prisma'
import { TPost } from "./types"

const prisma = new PrismaClient()

export async function getPost(id: number) {
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return null
  return decoratePost(post)
}

export async function getPosts(n = 5, sub?: string){
  const posts = await prisma.post.findMany({
    where: sub ? { subgroup: sub } : {},
    orderBy: { timestamp: "desc" },
    take: n,
  })
  return posts;
}

export async function decoratePost(post: TPost) {
  const user = await prisma.user.findUnique({ where: { id: post.creatorId } })
  const votes = await prisma.vote.findMany({ where: { postId: post.id } })
  const comments = await prisma.comment.findMany({
    where: { post_id: post.id },
    include: { creator: true },
  })

  return {
    ...post,
    creator: user,
    votes,
    comments,
  }
}

export async function getUser(id: number) {
  return prisma.user.findUnique({ where: { id } })
}

export async function getUserByUsername(uname: string) {
  return prisma.user.findUnique({ where: { uname } })
}

export async function updateVote(user_id: number, post_id: number, value: number) {
  const existing = await prisma.vote.findFirst({
    where: { userId: user_id, postId: post_id },
  })

  if (existing) {
    await prisma.vote.update({
      where: { id: existing.id },
      data: { value },
    })
  } else {
    await prisma.vote.create({
      data: { userId: user_id, postId: post_id, value },
    })
  }
}

export async function getVotesForPost(post_id: number) {
  return prisma.vote.findMany({ where: { postId: post_id } })
}

export async function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
) {
  const newPost = await prisma.post.create({
    data: {
      title,
      link,
      creatorId: creator,
      description,
      subgroup,
      timestamp: new Date(),
    },
  })
  return newPost;
}

export async function editPost(
  post_id: number,
  changes: {
    title?: string
    link?: string
    description?: string
    subgroup?: string
    timestamp?: number
  } = {}
) {
  const updateData: any = {}
  if (changes.title) updateData.title = changes.title
  if (changes.link) updateData.link = changes.link
  if (changes.description) updateData.description = changes.description
  if (changes.subgroup) updateData.subgroup = changes.subgroup
  if (changes.timestamp) updateData.timestamp = new Date(changes.timestamp)

  await prisma.post.update({
    where: { id: post_id },
    data: updateData,
  })
}

export async function deletePost(post_id: number) {
  await prisma.post.delete({ where: { id: post_id } })
}

export async function getSubs(): Promise<string[]> {
  const subs = await prisma.post.findMany({
    select: { subgroup: true },
    distinct: ['subgroup']
  })
  return subs.map(s => s.subgroup)
}

export async function addComment(post_id: number, creator: number, description: string) {
  return await prisma.comment.create({
    data: {
      post_id,
      creatorId: creator,
      description,
      timestamp: new Date(),
    },
  })
}

export async function deleteComment(commentId: number) {
  await prisma.comment.delete({ where: { id: commentId } })
}

export async function debug() {
  console.log("==== DATABASE DEBUGGING START ====");

  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();
  const comments = await prisma.comment.findMany();
  const votes = await prisma.vote.findMany();

  console.log("Users:", users);
  console.log("Posts:", posts);
  console.log("Comments:", comments);
  console.log("Votes:", votes);

  console.log("==== DATABASE DEBUGGING END ====");
}
