import React from "react";
import { observer } from "mobx-react-lite";
import Header from "../../components/Header";
import { useMst } from "../../models";
import { useParams } from "react-router-dom";

export default observer(() => {
  const store = useMst();
  const index = useParams().index;

  const dark = store.player.theme === "dark";

  const playlist = store.player.youtube.playlists[parseInt(index, 10)];

  return (
    <div>
      <Header back="/youtube" title={`${playlist.name} Settings`} dark={dark} />
      TODO
    </div>
  );
});
