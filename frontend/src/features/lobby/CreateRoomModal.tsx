import React, { useState } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import ReactModal from "react-modal";
import Button from "../../components/basic/Button";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

ReactModal.setAppElement("#root");

export const CreateRoomModal: React.FC<Props> = ({ isOpen, closeModal }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomSlugCreated, setRoomSlugCreated] = useState(null);

  const createRoom = async () => {
    const data = { room: { name: "" } };
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await axios.post("/be/api/v1/games", data);
      setIsLoading(false);
      if (res.status !== 201) {
        throw new Error("Room not created");
      }
      const room = res.data.success.room;
      setRoomSlugCreated(room.slug);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  if (roomSlugCreated != null) {
    return <Redirect push to={`/room/${roomSlugCreated}`} />;
  }

  return (
    <ReactModal
      closeTimeoutMS={200}
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Create New Game"
      overlayClassName="fixed inset-0 bg-black-50 z-50"
      className="insert-auto overflow-auto p-5 bg-gray-100 border max-w-lg mx-auto my-12 rounded-lg outline-none"
    >
      <h1 className="mb-2">Create Room</h1>
      <div className="">
        <div className="mb-4">
          <div className="font-semibold mb-2">Basic spades.</div>
          4 players, 2 teams of 2 each.
          <br />
          First team to 500 points wins.
          <br />
          Nils worth +100 or -100 points. Blind Nil not available.
          <br />
          10 bags are worth -100 points.
        </div>
        <p className="italic text-gray-600">No options available yet.</p>
      </div>

      <div className="mt-4">
        <Button onClick={createRoom} isPrimary disabled={isLoading}>
          Create
        </Button>
        <Button onClick={closeModal} className="ml-2">
          Cancel
        </Button>
      </div>
      {isError && (
        <div className="mt-2 bg-red-200 p-2 rounded border">
          Error creating room.
        </div>
      )}
    </ReactModal>
  );
};
export default CreateRoomModal;
