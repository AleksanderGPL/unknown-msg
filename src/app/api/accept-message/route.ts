import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated!",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      isAcceptingMessages: acceptMessages,
    });


    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update User status to accept messages",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Acceptance status updated successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update User status to accept messages", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update User status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated!",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Getting Message Acceptance status", error);

    return Response.json(
      {
        success: false,
        message: "Error in Getting Message Acceptance status",
      },
      { status: 500 }
    );
  }
}
