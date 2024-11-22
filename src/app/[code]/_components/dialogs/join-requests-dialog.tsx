"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMeeting } from "@/hooks/state/use-meeting";
import { initials } from "@/lib/utils";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useShallow } from "zustand/react/shallow";
import { PeerUserWithSocketId } from "@/types";
import { useSocket } from "@/hooks/state/use-socket";
import { useParams } from "next/navigation";

export default function JoinRequestsDialog() {
  const { joinRequests, removeJoinRequest } = useMeeting(
    useShallow((state) => ({
      joinRequests: state.joinRequests,
      removeJoinRequest: state.removeJoinRequest,
    })),
  );
  const socket = useSocket();
  const params = useParams();
  const answerRequest = (user: PeerUserWithSocketId, accept: boolean) => {
    socket.emit(accept ? "user:accepted" : "user:rejected", {
      user,
      code: params.code as string,
    });
    removeJoinRequest(user.peerId);
  };
  if (!joinRequests.length) return null;
  return (
    <div className="absolute left-4 top-4 rounded-xl bg-light-primary p-3 dark:bg-gray-800">
      <ScrollArea className="max-h-44 overflow-y-auto pr-3">
        <div className="space-y-2">
          {joinRequests.map((user) => (
            <div
              className="flex items-center justify-between gap-x-5"
              key={user.peerId}
            >
              <div className="flex items-center gap-x-3">
                <Avatar className="border-2 border-white ">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback>{initials(user.name || "")}</AvatarFallback>
                </Avatar>
                <div>{user.name}</div>
              </div>
              <div className="space-x-1">
                <Button size={"icon"} onClick={() => answerRequest(user, true)}>
                  <FaCheck />
                </Button>
                <Button
                  variant="red"
                  size={"icon"}
                  onClick={() => answerRequest(user, false)}
                >
                  <FaXmark />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
