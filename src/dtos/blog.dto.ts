export class BlogDto {
   author: string | Object;
   title: string;
   post: string;
}

export class BlogUpdateDto {
   title: string;
   post: string;
}

export class BlogResModel {
   id: string;
   author: string | Object;
   title: string;
   post?: string;
   status?: string;

   static createBlogRes(blog: any): BlogResModel {
      return {
         id: blog._id.toString(),
         author: blog.author.toString(),
         title: blog.title,
         post: blog.post,
      }
   }

   static fetchBlogRes(blog: any): BlogResModel {
      return {
         id: blog._id.toString(),
         author: {
            id: blog.author.id,
            fullName: blog.author.fullName
         },
         title: blog.title,
         post: blog.post,
         status: blog.status ? blog.status : undefined
      }
   }

   static fetchMultipleBlogRes(blog: any): BlogResModel {
      return {
         id: blog._id.toString(),
         author: {
            id: blog.author.id,
            fullName: blog.author.fullName
         },
         title: blog.title,
         status: blog.status ? blog.status : undefined
      }
   }
}