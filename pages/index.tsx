import Head from "next/head";
import React, { useState } from "react";
import { db, storage } from "../firebaseConfig.js";
import { collection, setDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import { query, orderBy } from "firebase/firestore";
import { onSnapshot, getDocs } from "firebase/firestore";
import { ref } from "firebase/storage";

export default function Home() {
  //1回目の緯度
  const [latitude, setLatitude] = useState(0);
  //1回目の経度
  const [longitude, setLongitude] = useState(0);
  //1回目のID
  const [firstID, setfirstID] = useState("");
  //2回目の緯度
  const [secondlatitude, setsecondLatitude] = useState(0);
  //2回目の経度
  const [secondlongitude, setsecondLongitude] = useState(0);
  //2回目のID
  const [secondID, setsecondID] = useState("");
  //食べ物
  const [foods, setFoods] = useState<any[]>([]);
  //距離
  const [calorie, setCalorie] = useState(500);
  //カロリー
  const [distance, setDistance] = useState(0);
  //歩数
  const [step, setStep] = useState(0);
  //処理中フラグ
  const [processing, setProcessing] = useState(false);

  // const [ foodData, setFoodData ] = useState: string[]([]);
  // const [process, setProces] = useState(false);
  //初回のデータ
  // const [firstdata, setFirstdata] = useState([]);
  // type Todo = {
  //   id: string;
  //   latitude: number;
  //   longitude: number;
  //   date: any;
  // };
  const [ID, setID] = useState(0);
  const [firedata, setFiredata] = useState<any[]>([]);
  const [currentfiredata, setcurrentFiredata] = useState<any[]>([]);
  // const databaseRef = collection(db, "first");
  // const q = query(databaseRef, orderBy("latitude", "desc"));

  //初回の緯度・経度取得
  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      getfirst();
      getsecond();
      getfoods();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getfirst = async () => {
    const firstCollectionRef = collection(db, "first");
    getDocs(firstCollectionRef).then((querySnapshot) => {
      return setFiredata(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    // setfirstID(firedata[0].id);
    // console.log("aa");
    // console.log(firstID);
  };

  const getsecond = async () => {
    const currentCollectionRef = collection(db, "current");
    getDocs(currentCollectionRef).then((querySnapshot) => {
      return setcurrentFiredata(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    setsecondID(currentfiredata[0]);
  };

  const getfoods = async () => {
    //データベースを取得
    const foodCollectionRef = collection(db, "foods");
    const q = query(foodCollectionRef, orderBy("calorie", "desc"));
    await getDocs(q).then((querySnapshot) => {
      //コレクションのドキュメントを取得
      setFoods(
        querySnapshot.docs.map((data) => {
          //配列なので、mapで展開する
          return { ...data.data(), id: data.id };
          //スプレッド構文で展開して、新しい配列を作成
        })
      );
    });

    // const currentCollectionRef = collection(db, "foods");
    // getDocs(currentCollectionRef)
    //   .then((querySnapshot) => {
    //     return setFoods(
    //       querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //     );
    //   })
  };

  //初回緯度経度firestoreにデータ保存
  const addfirstDate = async () => {
    if (processing) return;
    // 処理中フラグを上げる
    setProcessing(true);
    const firstRef = collection(db, "first");
    const newdate = new Date().toLocaleString("ja-JP");
    console.log(latitude);
    console.log(longitude);
    await addDoc(firstRef, {
      latitude: latitude,
      date: newdate,
      longitude: longitude,
    })
      .then(() => {
        console.log("投稿ができました！");
        setProcessing(false);
        getfirst();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeDate = () => {
    let fieldToEdit = doc(db, "first", firstID);
    deleteDoc(fieldToEdit)
      .then(() => {
        alert("記事を削除しました");
      })
      .catch((err) => {
        alert("記事の削除に失敗しました");
      });
  };

  // 二点間の座標から距離を求める
  function calcDistance(
    nowLatitude: number,
    nowLongitude: number,
    prevLatitude: number,
    prevLongitude: number
  ): number {
    const R = Math.PI / 180.0;
    const EarthRadius = 6371;
    nowLatitude *= R;
    nowLongitude *= R;
    prevLatitude *= R;
    prevLongitude *= R;
    const res =
      EarthRadius *
      Math.acos(
        Math.cos(prevLatitude) *
          Math.cos(nowLatitude) *
          Math.cos(nowLongitude - prevLongitude) +
          Math.sin(prevLatitude) * Math.sin(nowLatitude)
      );
    return res;
  }

  const GetCurrentGeo = async () => {
    //ボタンを押したら，latitudeとlongitudeを設定
    const prevLatitude = latitude;
    const prevLongtitude = longitude;
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setDistance(
        calcDistance(latitude, longitude, prevLatitude, prevLongtitude)
      );
    });
    CalcStrideStep();

    if (processing) return;
    // 処理中フラグを上げる
    setProcessing(true);
    const firstRef = collection(db, "current");
    const newdate = new Date().toLocaleString("ja-JP");
    console.log(latitude);
    console.log(longitude);

    await addDoc(firstRef, {
      latitude: latitude,
      date: newdate,
      longitude: longitude,
    })
      .then(() => {
        console.log("投稿ができました！");
        setProcessing(false);
        getsecond();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 距離から歩数を計算
  const CalcStrideStep = () => {
    const strideLength = 0.0008; //歩幅は80cm km換算
    const res = Math.floor(distance / strideLength);
    setStep(res);
  };

  // db.collection("titles").onSnapshot(async (snapshot) =>
  // // listsのデータがここで完成する
  // {
  //   const fileNameWithExts = snapshot.docs
  //     .map((doc) => doc.data())
  //     .map((name) => {
  //       // console.log(name)
  //       return {name.text, name.aaa};
  //     });

  // const foodsURL = await Promise.all(
  //   nameOfFoods.map(async (nameOfFood) => {
  //     const urls = `gs://pictures-storage-5b9d3.appspot.com/images/${nameOfFood}`;

  //     const gsReference = ref(storage, urls);

  //     const url = await getDownloadURL(gsReference).catch((err) =>
  //       console.log(err)
  //     );

  //     const imageSize = await getImageSize(url).catch((e) =>
  //       console.log(e.message)
  //     );

  //     return {
  //       url,
  //       fileNameWithExt,
  //     }

  return (
    <>
      <Head>
        <title>カロリー計算 | App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="center">
        <div className="btn-margin">
          <button
            id="btn"
            className="btn btn-outline-primary btn-lg"
            onClick={GetCurrentGeo}
          >
            現在の位置を取得する
          </button>
        </div>
        <div className="btn-margin">
          <button
            id="btn"
            className="btn btn-outline-primary btn-lg"
            onClick={addfirstDate}
          >
            最初の位置を取得する
          </button>
        </div>

        <div className="btn-margin">
          <button
            id="btn"
            className="btn btn-outline-primary btn-lg"
            // onClick={}
          >
            計算する
          </button>
        </div>
        <div className="btn-margin">
          {currentfiredata.map((currentdata) => (
            <div key={currentdata.id}>
              {firedata.map((data) => (
                <div key={data.id}>
                  <button
                    id="btn"
                    className="btn btn-outline-primary btn-lg"
                    onClick={() => removeDate()}
                  >
                    履歴を削除する
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <h3>最初の位置</h3>
        <div className="txt-margin">
          {firedata.length === 0 && <p>データがありません</p>}
          {firedata
            .filter((data) => {
              if (data.calorie === 500) {
                return data;
              }
              {
                return data;
              }
            })
            .map((data) => (
              <div key={data.id}>
                <p>
                  {data.id}
                  緯度：<span id="latitude">{data.latitude}</span>
                  <span>度</span>
                </p>
                <p>
                  経度：<span id="longitude">{data.longitude}</span>
                  <span>度</span>
                </p>
              </div>
            ))}
        </div>

        <h3>2回目の位置</h3>
        <div className="txt-margin">
          {currentfiredata.length === 0 && <p>データがありません</p>}
          {currentfiredata.map((data) => (
            <div key={data.id}>
              {data.id === undefined && <p>データなし</p>}
              <p>
                {data.id}
                緯度：<span id="latitude">{data.latitude}</span>
                <span>度</span>
              </p>
              <p>
                経度：<span id="longitude">{data.longitude}</span>
                <span>度</span>
              </p>
            </div>
          ))}
        </div>

        <div className="distance">
          <p>
            現在歩いた距離:<span id="distance">{distance}</span>
            <span>km</span>
          </p>
        </div>
        <div className="step">
          <p>
            現在歩いた歩数:<span id="step">{step}</span>
            <span>歩</span>
          </p>
        </div>
        <div className="food">
          {/* TODO: 食べていいものをDBから引っ張ってきて表示させる */}
          <h2>食べられる食事</h2>

          {foods.map((food) => (
            <div key={food.id}>
              <p>
                名前<span id="latitude">{food.name}</span>
              </p>
              <p>
                カロリー<span id="latitude">{food.calorie}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
