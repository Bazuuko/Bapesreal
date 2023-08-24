import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import background from "./styles/bg.png";
import styled from "styled-components";
import Accordion from './Accordion';
import video from "./img/video.mp4";
import styles from "./App.css"

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  letter-spacing: 8px;
  border-radius: 10px;
  padding: 10px;
  border: none;
  background-color: #517ef4;
  font-weight: bold;
  font-size: 25px;
  color: var(--accent-text);
  width: 270px;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  font-family: 'Orbitron', sans-serif;
`;

export const StyledButton2 = styled.button`
  letter-spacing: 10px;
  border-radius: 10px;
  padding: 10px;
  border: none;
  background-color: #517ef4;
  font-weight: bold;
  font-size: 25px;
  color: var(--accent-text);
  width: 170px;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  font-family: 'Orbitron', sans-serif;
`;


export const StyledRoundButton = styled.button`
  padding: 10px;
  color: white;
  background: transparent;
  border-radius: 100%;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton2 = styled.button`
  background: transparent;
  border-radius: 100%;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 30px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 130px;
  transition: width 0.5s;
  transition: height 0.5s;
`;


export const StyledImg = styled.img`
  transition: width 0.5s;
`;

export const StyledImg2 = styled.img`
width: 495px;
  transition: width 0.5s;
`;

export const StyledImg3 = styled.img`
  width: 90%;
  opacity: 90%;
  box-shadow: 0 0 10px black inset;
  border-radius: 5%;
`;

export const StyledImg4 = styled.img`
  width: 1300px;
`;

export const StyledImg5 = styled.img`
  width: 800px;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;




function App() {
  const accordionData = [
    {
      title: 'Bridge to BaseChain Mainnet',
      content: `We have a full-visual and lovely tutorial about how to do it from the Ethereum Network in our twitter!. https://twitter.com/basedapesyt/status/1687585722717372416`
    },
    {
      title: 'How to mint',
      content: `You must make sure that you are connected to the BaseChain Mainnet. \n
      Once you have been able to bridge your desired $ETH to the Base Network go to our mint section, connect your wallet and select how many amounts of Based Apes you want to mint!`
    },
    {
      title: 'How much is the supply?',
      content: `10,000 unique Based Bored Ape NFTs`
    },
{
      title: 'How do I see them?',
      content: `You can view your minted Ape on our official Telegram announcement mint bot (named Patrick) or on your profile on Opensea! 
      `},
  ];
  const dispatch = useDispatch();
  const aboutRef = useRef(null);
  const faqRef = useRef(null);
  const mintRef = useRef(null);
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [isActive, setIsActive] = useState(false);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Select quantity mint`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = 6900000000000001;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    let totalCostWeiNum = cost * mintAmount
    let trueCost = BigInt(totalCostWeiNum).toString();
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: trueCost,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Something went wrong. Please try again.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Welcome to our Yacht! You minted ${mintAmount} ${CONFIG.NFT_NAME}!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const handleRoadmap = () => {
    aboutRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  const handleFaq = () => {
    faqRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  const handleMint = () => {
    mintRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  const handleMintFun = () => {
    window.open(
      'https://mint.fun/base/0xa3341a3dac5685d83729de35e43d3e8e587c3257',
      '_blank'
    );
  };

  const handleTwitter = () => {
    window.open(
      'https://twitter.com/basedapesyt',
      '_blank'
    );
  };

  const handleTelegram = () => {
    window.open(
      'https://t.me/baseboredapes',
      '_blank'
    );
  };


  return (
    <s.Screen>

      <div className="main" style={{display:"flex", 
      backgroundImage: `url(${background})`,
      flex: "1",
       }}>

<s.Container
        ai={"center"}
        style={{display:"flex", marginLeft: "70px"}}
        >

        <div className="nav" style={{display:"flex", marginTop:"30px", marginLeft: "-30px"}}>
          <div className="logo" style={{display:"flex"}}>
            <div>
            <StyledLogo
        src={"/config/images/logo.png"}
        /></div>
        <div>
       <s.TextNav2
            style={{
                fontSize: 45,
                fontWeight: "bold",
                padding: 10,
                color: "var(--accent)",
                marginTop: "15px",
                marginLeft: "15px",
              }}
            >
              Based Bored Apes
       </s.TextNav2></div>
          </div>
          
          <div className="bar" style={{display:"flex", marginLeft: "320px",  marginTop: "37px",}}>
          <div className="option1" onClick={handleRoadmap}>
          <s.TextNav
            style={{
                textAlign: "center",
              }}
            >
              Roadmap
       </s.TextNav>
          </div>

          <div className="option2" style={{marginLeft:"100px"}}>
          <s.TextNav
            style={{
                textAlign: "center",
              }}
            >
              Whitepaper
       </s.TextNav>
          </div>

          <div className="option3" style={{marginLeft:"100px"}} onClick={handleFaq}>
          <s.TextNav
            style={{
                textAlign: "center",
              }}
            >
              FAQ
       </s.TextNav>
          </div>
          </div>  
       </div>
   

       <s.SpacerLargeX />
       <s.SpacerMedium />

       <div class="menu" style={{display:"flex", marginLeft: "0px"}}>
      <div class="video"  style={{marginTop:"-40px"}}>

      <video width="550" autoPlay muted loop>
      <source src={video} type="video/mp4"/>
        </video>

      </div>
      <div class="info" 
       style={{
        marginTop: "-50px",
        marginLeft: 60
       }}>
      <s.TextTitle 
       style={{
          fontSize: 80,
       }}>
          First Bored Apes living
        </s.TextTitle>
        <s.TextTitle 
       style={{
          fontSize: 80,
          marginTop: -30
       }}>
          on <b>BaseChain</b>
        </s.TextTitle>
        <s.SpacerMedium />

        <StyledButton onClick={handleMint}
        style={{
              boxShadow: "2px 5px 5px 4px rgba(0,0,0,0.5)",
              width: "250px",
              marginLeft: 40,
              padding: 15,
            }}
            >
            MINT NOW
        </StyledButton>

        <StyledButton onClick={handleMintFun}
        style={{
              boxShadow: "2px 5px 5px 4px rgba(0,0,0,0.5)",
              width: "250px",
              marginLeft: 40,
              padding: 15,
            }}
            >
            MINT.FUN
        </StyledButton>
      
        <s.SpacerSmall />
        <s.SpacerLargeX />
        <s.TextTitle2 
       style={{
          fontSize: 24,
       }}>
          The most Based Apes arrived to
        </s.TextTitle2>
        <s.TextTitle2 
       style={{
          fontSize: 24,
       }}>
          Base Mainnet. Base Bored Apes features high-quality art crafted 
          <s.TextTitle2 
       style={{
          fontSize: 24,
       }}>
          to incorporate color and references dedicated to BaseChain.
        </s.TextTitle2>
        </s.TextTitle2>
        <s.TextTitle2 
       style={{
          fontSize: 24,
       }}>
          Join our Yacht now!
        </s.TextTitle2>

      </div>
      </div>

      <s.SpacerLargeXX />
      <s.SpacerLarge />

      <StyledImg
        src={"/config/images/bannerbar.png"}
        />

<s.SpacerLargeXX />
      <s.SpacerLarge />
       

<div class="text" style={{display:"flex"}}>




      <s.TextTitle 
      style={{
        marginLeft: 100,
        textAlign: "right",
        marginTop: 20,
      }}
      >
        WELCOME TO THE BASED YACHT CLUB
      </s.TextTitle>

<div class="paf">

      <s.TextSubTitle
      style={{
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold",
        letterSpacing: 2,
        color: "var(--accent-text)",
        marginTop: 70,
        marginLeft: 50,
        marginRight: 50
      }}
    >

  Based Bored Apes is a collection of 10,000 unique NFTs living on the Base Mainnet. All Apes are just incredible and based, but some are rare than others. Each one have attributes that make them unique according to a defined rarity system including glasses, headwears, clothing, mouth and more special things to discover!
</s.TextSubTitle>

<s.TextSubTitle
      style={{
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold",
        letterSpacing: 2,
        color: "var(--accent-text)",
        marginLeft: 50,
        marginRight: 50
      }}
    >
Mixing the artwork of Base with Bored Apes in an artistic way, BBA YC seeks to form and establish its own community on the network.
</s.TextSubTitle>

</div>
<StyledImg2
        src={"/config/images/panel1.png"}
        style={{
          marginLeft: "0",
          marginRight: "10px",
          marginTop: "-25px"
        }}
        
        />

</div>



        <s.SpacerLargeX />
        <s.SpacerMedium />

        <s.TextTitle 
       style={{
          fontSize: 70,
          letterSpacing: 20
       }}>
          Roadmap
        </s.TextTitle>

        <s.SpacerLargeX />
        <div ref={aboutRef}></div>
        <s.SpacerMedium />
        
        <StyledImg3
        src={"/config/images/map.png"}
        style={{
          marginLeft: "0",
        }}
        
        />

<s.SpacerLargeX />

<s.SpacerLargeXX />

<StyledImg4
        src={"/config/images/roadmap.png"}
        style={{
          marginLeft: "0",
        }}
        
        />
<s.SpacerLargeX />
<s.TextTitle 
       style={{
          fontSize: 70,
          letterSpacing: 20
       }}>
          $BBAPE
        </s.TextTitle>
        <s.SpacerMedium />
<StyledImg2
        src={"/config/images/apetoken.png"}
        style={{
          marginLeft: "0",
        }}
        
        />



        <s.SpacerLargeXX />
      <s.SpacerLarge />

      <StyledImg
        src={"/config/images/bannerbar.png"}
        />

<s.SpacerLargeXX />
      <s.SpacerLarge />

        <div ref={mintRef}>
<s.SpacerLargeX />
<s.SpacerLarge />


 
<ResponsiveWrapper flex={1} style={{ padding: 20 }} test>
        
        <s.SpacerLarge />
        <s.Container
          flex={1}
          jc={"center"}
          ai={"center"}
          image={CONFIG.SHOW_BACKGROUND ? "/config/images/square.png" : null}
          style={{
            paddingTop: 60,
            paddingLeft: 200,
            paddingRight: 200,
            borderRadius: 24,
            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
          }}
        >  
          <StyledImg5
        src={"/config/images/bba.png"}
        />
          <s.SpacerLarge />
          <s.TextSubTitle2
            style={{
              textAlign: "center",
              fontSize: 40,
              fontWeight: 1000,
              letterSpacing: 25,
              color: "var(--secondary-text)",
              marginTop: "-20px",
            }}
          >
            
            MINT LIVE
          </s.TextSubTitle2>
          <s.SpacerLargeX />
          <StyledImg2 
            src={"/config/images/gif.gif"}
          />
<s.SpacerLargeX />
         

          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
            <>
             <s.SpacerXSmall />
              <s.TextTitle
                style={{ textAlign: "center", color: "var(--accent-text)" }}
              >
                The sale has ended.
              </s.TextTitle>
              <s.TextDescription
                style={{ textAlign: "center", color: "var(--accent-text)" }}
              >
                You can still find {CONFIG.NFT_NAME} on
              </s.TextDescription>
              <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                {CONFIG.MARKETPLACE}
              </StyledLink>

              
            </>
          ) : (
            <>
              <s.TextTitle3
                style={{ textAlign: "center", color: "var(--accent-text)" }}
              >
                Cost: 0.0069 ETH
              </s.TextTitle3>
              <s.SpacerXSmall />
              <s.TextTitle3
                style={{ textAlign: "center", color: "var(--accent-text)" }}
              >
                {data.totalSupply} out of {CONFIG.MAX_SUPPLY} minted
              </s.TextTitle3>
              <s.SpacerLarge />
              {blockchain.account === "" ||
              blockchain.smartContract === null ? (
                <s.Container ai={"center"} jc={"center"}>
                  
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                    
                  >
                    Connect to the {CONFIG.NETWORK.NAME} network
                  </s.TextDescription>
                  <s.SpacerLargeX />
                  <s.SpacerLarge />
                  <StyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                  >
                    CONNECT
                  </StyledButton>
                 
                  {blockchain.errorMsg !== "" ? (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {blockchain.errorMsg}
                      </s.TextDescription>
                    </>
                  ) : null}
                </s.Container>
              ) : (
                <>
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >
                    
                    {feedback}
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledRoundButton
                      style={{ lineHeight: 0.4 }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        decrementMintAmount();
                      }}
                    >
                      -
                    </StyledRoundButton>
                    <s.SpacerMedium />
                    
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {mintAmount}
                    </s.TextDescription>
                    
                    <s.SpacerMedium />
                    <StyledRoundButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        incrementMintAmount();
                      }}
                    >
                      +
                    </StyledRoundButton>
                  </s.Container>
                  
                  <s.SpacerMedium />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledButton2
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}
                    >
                      {claimingNft ? "BUSY" : "MINT"}
                    </StyledButton2>
                    
                  </s.Container>
                </>
              )}
            </>
          )}
          
          <s.SpacerLargeX />
         
        </s.Container>
        
        <s.SpacerLarge />
        
       <s.SpacerLarge />
      </ResponsiveWrapper>

      </div>

      <div class="faq" ref={faqRef}></div>

      <s.SpacerLargeXX />
      <s.SpacerLarge />

      <StyledImg
        src={"/config/images/bannerbar.png"}
        />

<s.SpacerLargeXX />
      <s.SpacerLarge />

        <div class="accordion">

{accordionData.map(({ title, content }) => (
  <Accordion title={title} content={content} />
))}

</div>
  
      
      <s.SpacerLargeXX />
<s.SpacerLarge />



<s.SpacerLarge />

</s.Container>
      </div>
    </s.Screen>
  );
}

export default App;
