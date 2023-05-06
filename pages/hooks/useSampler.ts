import { useEffect, useState } from "react";
import {
  AMOUNT_TO_NO_COLLECTORS_72,
  AMOUNT_TO_NO_COLLECTORS_ALL_TIME,
  HIGHEST_COLLECTOR_SPEND_72,
  TOP_50_COLLECTORS_ALL_TIME,
  TOP_50_MIRRORS_ALL_TIME,
  TOP_50_POSTERS_ALL_TIME,
  TOP_FOLLOWED_ACCOUNTS_48,
  TOTAL_POST_W_REVENUE_24,
  TOTAL_POST_W_REVENUE_48,
  UNIQUE_COLLECTS_24,
} from "@/lib/bigquery/queries";
import { VIDEO } from "@/lib/bigquery/queries";
import { MUSIC } from "@/lib/bigquery/queries";
import { ART } from "@/lib/bigquery/queries";
import { HASHTAGS_TOP } from "@/lib/bigquery/queries";
import { INTERESTS_TOP } from "@/lib/bigquery/queries";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import samplerABI from "./../../abi.json";

const useSampler = () => {
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const [contractArgs, setContractArgs] = useState<any[]>([]);

  const { config, isSuccess } = usePrepareContractWrite({
    address: "0x948ed9CD14Ce2B60Cee4bca0BCe1a65B95BD34d2",
    abi: samplerABI,
    args: contractArgs,
    functionName: "addDailyMappings",
    enabled: Boolean(contractArgs.length > 0),
  });

  const { writeAsync } = useContractWrite(config);

  const getSampler = async () => {
    setStatsLoading(true);
    try {
      const revenue48 = await fetch("/api/bigquery", {
        method: "POST",
        body: TOTAL_POST_W_REVENUE_48,
      });
      const revenue24 = await fetch("/api/bigquery", {
        method: "POST",
        body: TOTAL_POST_W_REVENUE_24,
      });
      const collectTop = await fetch("/api/bigquery", {
        method: "POST",
        body: TOP_50_COLLECTORS_ALL_TIME,
      });
      const mirrorTop = await fetch("/api/bigquery", {
        method: "POST",
        body: TOP_50_MIRRORS_ALL_TIME,
      });
      const postTop = await fetch("/api/bigquery", {
        method: "POST",
        body: TOP_50_POSTERS_ALL_TIME,
      });
      const amountToCollectAll = await fetch("/api/bigquery", {
        method: "POST",
        body: AMOUNT_TO_NO_COLLECTORS_ALL_TIME,
      });
      const amountToCollect72 = await fetch("/api/bigquery", {
        method: "POST",
        body: AMOUNT_TO_NO_COLLECTORS_72,
      });
      const highestSpend = await fetch("/api/bigquery", {
        method: "POST",
        body: HIGHEST_COLLECTOR_SPEND_72,
      });
      const unique = await fetch("/api/bigquery", {
        method: "POST",
        body: UNIQUE_COLLECTS_24,
      });
      const follow = await fetch("/api/bigquery", {
        method: "POST",
        body: TOP_FOLLOWED_ACCOUNTS_48,
      });
      const video = await fetch("/api/bigquery", {
        method: "POST",
        body: VIDEO,
      });
      const music = await fetch("/api/bigquery", {
        method: "POST",
        body: MUSIC,
      });
      const art = await fetch("/api/bigquery", {
        method: "POST",
        body: ART,
      });
      const hashtags = await fetch("/api/bigquery", {
        method: "POST",
        body: HASHTAGS_TOP,
      });
      const interests = await fetch("/api/bigquery", {
        method: "POST",
        body: INTERESTS_TOP,
      });
      if (
        collectTop.ok &&
        mirrorTop.ok &&
        postTop.ok &&
        amountToCollectAll.ok &&
        amountToCollect72.ok &&
        highestSpend.ok &&
        unique.ok &&
        interests.ok &&
        video.ok &&
        art.ok &&
        music.ok &&
        hashtags.ok &&
        follow.ok &&
        revenue24.ok &&
        revenue48.ok
      ) {
        const dataCollect = await collectTop.json();
        const dataMirror = await mirrorTop.json();
        const dataPost = await postTop.json();
        const dataAmountAll = await amountToCollectAll.json();
        const dataAmount72 = await amountToCollect72.json();
        const highest = await highestSpend.json();
        const dataUnique = await unique.json();
        const artValue = await art.json();
        const videoValue = await video.json();
        const musicValue = await music.json();
        const hashtagValue = await hashtags.json();
        const interestValue = await interests.json();
        const followValue = await follow.json();
        const rev24 = await revenue24.json();
        const rev48 = await revenue48.json();

        const newArray = [
          dataMirror,
          dataCollect,
          dataPost,
          dataUnique,
          highest,
          dataAmountAll,
          dataAmount72,
          followValue,
          [rev24, rev48],
          [hashtagValue, interestValue, artValue, videoValue, musicValue],
        ];

        const ipfsValues = [];

        for (let i = 0; i < newArray.length; i++) {
          let response;

          if (i <= 7) {
            response = await fetch("/api/ipfs", {
              method: "POST",
              body: JSON.stringify(newArray[i].rows),
            });
          } else if (i === 8) {
            response = await fetch("/api/ipfs", {
              method: "POST",
              body: JSON.stringify([
                {
                  total_amount_48: rev24.rows.reduce(
                    (acc: string, cur: any) =>
                      Number(acc) + Number(cur.total_amount),
                    0
                  ),
                },
                {
                  total_amount_24: rev48.rows.reduce(
                    (acc: string, cur: any) =>
                      Number(acc) + Number(cur.total_amount),
                    0
                  ),
                },
                { total_post_24: rev24.rows.length },
                { total_post_48: rev48.rows.length },
              ]),
            });
          } else {
            response = await fetch("/api/ipfs", {
              method: "POST",
              body: JSON.stringify([
                hashtagValue.rows,
                interestValue.rows,
                musicValue.rows,
                artValue.rows,
                videoValue.rows,
              ]),
            });
          }

          if (response.status === 200) {
            let responseJSON = await response.json();
            ipfsValues.push("ipfs://" + responseJSON.cid);
          }
        }
        setContractArgs(ipfsValues);
        console.log({ ipfsValues });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setStatsLoading(false);
  };

  const writeSampler = async () => {
    try {
      const tx = await writeAsync?.();
      await tx?.wait();
      console.log({ hash: tx?.hash });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      writeSampler();
    }
  }, [isSuccess]);

  return { getSampler, statsLoading };
};

export default useSampler;
