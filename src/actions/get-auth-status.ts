// "use server";

// import { db } from "@/lib";
// import { currentUser } from "@clerk/nextjs/server";

// const getAuthStatus = async () => {
//     const user = await currentUser();

//     if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
//         return { error: "User not found" };
//     }

//     let clerkId = user.id;

//     const existingUser = await db.user.findFirst({
//         where: {
//             clerkId,
//         },
//     });

//     console.log("existingUser", existingUser);

//     if (!existingUser) {
//         await db.user.create({
//             data: {
//                 clerkId,
//                 email: user.primaryEmailAddress.emailAddress,
//                 name: user.fullName || user.firstName,
//                 image: user.imageUrl,
//             },
//         });
//     }

//     return { success: true };
// };

// export default getAuthStatus;





"use server";

import { db } from "@/lib";
import { currentUser } from "@clerk/nextjs/server";

const getAuthStatus = async () => {
  try {
    console.log("getAuthStatus started");

    const user = await currentUser();
    console.log("currentUser:", user?.id);

    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
      console.log("User not found");
      return { error: "User not found" };
    }

    const clerkId = user.id;

    const existingUser = await db.user.findFirst({
      where: { clerkId },
    });

    console.log("existingUser:", existingUser);

    if (!existingUser) {
      console.log("Creating new user...");

      const createdUser = await db.user.create({
        data: {
          clerkId,
          email: user.primaryEmailAddress.emailAddress,
          name: user.fullName || user.firstName || "",
          image: user.imageUrl,
        },
      });

      console.log("createdUser:", createdUser);
    }

    console.log("Returning success");
    return { success: true };
  } catch (error) {
    console.error("AUTH STATUS ERROR:", error);
    return { error: "Something failed" };
  }
};

export { getAuthStatus };