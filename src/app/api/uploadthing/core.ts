import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getUserSubscriptionPlan } from "@/lib/monime"

import {PLANS} from "@/config/stripe"
import { getEndpointByFileType, getFileType, updateStatusInDb } from "@/lib/elegance";
export const maxDuration = 300;

const f = createUploadthing();

const middleware = async() => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan()
  return { subscriptionPlan , userId: user.id };

}

//  run this code after upload completed to upload thing
// const onUploadComplete = async({metadata, file}: {
//   metadata: Awaited<ReturnType<typeof middleware>>
//   file: {
//     key:string,
//     name:string,
//     url: string
//   }
// }) => {

//   const isFileExists = await db.file.findFirst({
//     where: {
//       key: file.key
//     }
//   })
//   if(isFileExists){
//     return
//   }

//   const {extension, name: fileType} = getFileType(file.name);
  
//   const createdFile = await db.file.create({
//     data: {
//       key: file.key,
//       name: file.name,
//       userId: metadata.userId,
//       url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
//       uploadStatus: "PROCESSING",
//     },
//   });

//   const endpoint = getEndpointByFileType(fileType);
//   console.log("this is the endpoint: ", endpoint)
//   try {

//     const responseCF = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({createdFile, mimeType: extension})
//     })
//     if(responseCF.ok){
//       // update the file status to success
//       await updateStatusInDb({uploadStatus:"SUCCESS", createdFile})
//     }
//     const data = await responseCF.json()
//     console.log("This is the data from the cloud functions", data)
    
//     // const response = await fetch(
//     //   `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
//     // );
//     // const blob = await response.blob();


//   //   const loader = new PDFLoader(blob);
//   //   const pageLevelDocs = await loader.load();
//   //   const pageAmnt = pageLevelDocs.length;
    
//   //   const {subscriptionPlan} = metadata
    
//   //   const { isSubscribed } = subscriptionPlan
//   //   const isProExceeded = pageAmnt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf
    
//   //   const isFreeExceeded = pageAmnt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf
//   //  //(isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)
//   //   if((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)){
//   //     await updateStatusInDb({uploadStatus:"FAILED", createdFile})
//   //   } else{

//   //     // Process pages in batches
//   //     const batchSize = 50; 

//   //     const totalPages = pageLevelDocs.length;
//   //     for (let startIndex = 0; startIndex < totalPages; startIndex += batchSize) {
        
//   //         // creating the batch //
//   //         const batch = pageLevelDocs.slice(startIndex, startIndex + batchSize);

//   //         // process the pages by batches ///
//   //         await processBatch({batch, startIndex, createdFile});
//   //     }
      
//   //     // update the file status to success
//   //     await updateStatusInDb({uploadStatus:"SUCCESS", createdFile})
      
//   //     console.log("PDF Vectorization and Pinecone Indexing complete!");
  
//   //  }
//   } catch (error) {
//     // Handle errors
//     // await updateStatusInDb({uploadStatus:"FAILED", createdFile})
    
//     // console.error("Error:", error);
//   }
// }

const processFilesInBatch = async ({metadata, files}: {
  metadata: Awaited<ReturnType<typeof middleware>>
  files: {
    key:string,
    name:string,
    url: string
  }[]
}) => {
  const batchPromises = files.map(async (file) => {
    const isFileExists = await db.file.findFirst({
      where: { key: file.key },
    });

    if (isFileExists) return;

    const { extension, name: fileType } = getFileType(file.name);
    const createdFile = await db.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId:metadata.userId,
        url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        uploadStatus: "PROCESSING",
      },
    });

    const endpoint = getEndpointByFileType(fileType);

    try {
      const responseCF = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createdFile,
          mimeType: extension,
          fileContent: { url: createdFile.url },
        }),
      });

      if (responseCF.ok) {
        await updateStatusInDb({ uploadStatus: "SUCCESS", createdFile });
      } else {
        throw new Error("Failed to process file");
      }

      const data = await responseCF.json();
      console.log("Data from cloud functions:", data);
    } catch (error:any) {
      await updateStatusInDb({ uploadStatus: "FAILED", createdFile });
      console.error("Error:", error.message);
    }
  });

  await Promise.all(batchPromises);
};

const onUploadComplete = async (opts: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  // await processFilesInBatch({
  //   metadata: opts.metadata,
  //   files: [opts.file],
  // });

};
export const ourFileRouter: FileRouter = {
  freePlanUploader: f({ 
    pdf:  { maxFileSize: "4MB", maxFileCount:  50}, 
    image: {maxFileSize: "4MB", maxFileCount: 50}, 
    video: {maxFileSize: "16GB", maxFileCount: 50}, 
    audio: {maxFileSize: "16GB", maxFileCount:50},
  })
    .middleware(middleware)
    .onUploadError(({error}) => {
      console.log(error)
    })
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ 
    pdf:  { maxFileSize: "4MB", maxFileCount:  50}, 
    image: {maxFileSize: "4MB", maxFileCount: 50}, 
    video: {maxFileSize: "16GB", maxFileCount: 50}, 
    audio: {maxFileSize: "16GB", maxFileCount:50},
  })
  .middleware(middleware)
    .onUploadComplete(onUploadComplete)
};

export type OurFileRouter = typeof ourFileRouter;
