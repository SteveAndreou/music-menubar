import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useMst } from "../../models";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import PlayerControls from "../../components/PlayerControls";
import { getRandomGif } from "../../utils";
import "youtube";
import clsx from "clsx";
import Loader from "react-loader-spinner";

// const baseURL = "https://www.googleapis.com/youtube/v3/playlistItems";

// hard coding here becuase import 'youtube' wasn't actually loading script
if (typeof YT == "undefined" || typeof YT.Player == "undefined") {
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
}

export default observer(() => {
  const store = useMst();

  const { youtube, theme } = store.player;
  const dark = theme === "dark";

  const { index } = useParams();

  const stream = youtube.streams[Number(index)];

  const [player, createPlayer] = useState<YT.Player | undefined>();

  const [playing, setPlaying] = useState(false);

  const [current, setCurrent] = useState<
    { title: string; url: string } | undefined
  >();

  const [bg, setBg] = useState<any>();

  function onPlayerReady(_: any) {
    // e.target.loadVideo({
    //   list: playlist.playlistId,
    //   listType: "playlist",
    //   index: 0,
    //   startSeconds: 0,
    //   suggestedQuality: "small",
    // });
  }

  function onPlayerStateChange(e: any) {
    console.log(e.target.playerInfo);

    const { videoUrl } = e.target.playerInfo;
    const { title } = e.target.playerInfo.videoData;

    const currentlyPlaying = e.target.getPlayerState() === 1;

    if (currentlyPlaying !== playing) {
      if (!playing && currentlyPlaying) {
        setBg(getRandomGif().gif);
      }
      setPlaying(currentlyPlaying);
    }

    if (!current || current.title !== title || current.url !== videoUrl) {
      setCurrent({ title, url: videoUrl });
    }
  }

  useEffect(() => {
    if (!player) {
      createPlayer(
        // @ts-ignore
        new YT.Player("player", {
          height: "300",
          width: "300",
          videoId: stream.videoId,
          playerVars: {
            controls: "0",
            autoplay: "1",
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        })
      );

      setPlaying(true);
    }
  });

  return (
    <div
      className={clsx(dark && "bg-dark", "relative h-screen overflow-hidden")}
    >
      <Header
        back="/youtube"
        title={stream.name}
        editable
        onEdit={stream.changeName}
        dark
        clear
      />

      <div id="player" className="hidden" />

      <img className="absolute object-cover w-screen h-screen top-0" src={bg} />

      {!bg && (
        <div className="full-minus-header flex items-center justify-center">
          <Loader type="Bars" color="#00BFFF" height={80} width={80} />
        </div>
      )}

      {player && current && bg && (
        <a className="px-2 text-center absolute inset-0 flex items-center justify-center text-white font-semibold text-2xl text-shadow-lg tracking-wider">
          {current.title}
        </a>
      )}

      {player && (
        <PlayerControls
          playing={playing}
          onPlay={() => {
            player.playVideo();
            setPlaying(true);
          }}
          onPause={() => {
            player.pauseVideo();
            setPlaying(false);
          }}
        />
      )}
    </div>
  );
});
