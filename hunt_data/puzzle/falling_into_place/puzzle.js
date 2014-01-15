// this ChromeVersion function used to be at, but google keeps changing things...
// http://www.google.com/chrome/intl/en/webmasters-faq.html
function ChromeVersion() {
    try {
    return parseFloat(navigator.userAgent.match(/Chrome\/(\d+\.\d+)/)[1]) || undefined;
    } catch(e) {}
    return undefined;
}

    var naclModule = null;

    var outHist = null;
    function logHist(msg) {
       if(outHist === null)
       {
          outHist = document.getElementById('clueHist');
       }
       outHist.innerHTML = msg.substr(5) + outHist.innerHTML;
    }
    var outClue = null;
    function setClue(msg) {
       if(outClue === null)
       {
          outClue = document.getElementById('activeClue');
       }
       outClue.innerHTML = msg.substr(5);
    }
    function setGrid(msg) {
       buildSpaceArray();

       var gg = msg.substr(5);
       var i;
       var row = 0;
       var col = 0;
       for (i = 0; i < gg.length; i++)
       {
          if (gg[i] == '\n')
          {
             row++;
             col = 0;
          }
          else
          {
             setSquare(spaceArray[col + 10 * row], gg[i]);             
             col++;
          }
       }
    }

    function setColor(msg) {
       var gg = msg.substr(6);
       var i;
       var row = 0;
       var col = 0;
       for (i = 0; i < gg.length; i++)
       {
          if (gg[i] == '\n')
          {
             row++;
             col = 0;
          }
          else
          {
             var sq = spaceArray[col + 10 * row];
             var chr = gg[i];
             if (chr == 'r')
             {
                sq.style.backgroundColor="#ff0000";
             }
             else if (chr == 'g')
             {
                sq.style.backgroundColor="#00ff00";
             }
             else
             {
                // revert to white, IF it's been colored
                if (sq !== undefined)
                {
                   if (sq.style.backgroundColor === "rgb(255, 0, 0)" ||
                       sq.style.backgroundColor === "rgb(0, 255, 0)")
                   {
                      sq.style.backgroundColor="#ffffff";
                   }
                }
             }
             col++;
          }
       }
    }

    var audioArray = new Array();
    function playAud(msg) {
       if(audioArray.length == 0)
       {
          var i;
          for (i = 0; i < 10; i++)
          {
             var snd = document.getElementById('aud' + i);
             snd.addEventListener('ended', function() { this.pause(); this.currentTime = 0; }, false);
             audioArray[i] = snd;
          }
       }
       
       var snd = audioArray[msg.substr(4)];
       snd.currentTime = 0;
       snd.play();
    }

    var spaceArray = new Array();
function buildSpaceArray()
{
   if(spaceArray.length == 0)
   {
      var i;
      var j;
      var k;
      for (i = 0; i < 10; i++)
      {
         for (j = 0; j < 20; j++)
         {
            spaceArray[i + 10 * j] = document.getElementById('s' + i + j);
            //console.log('s'+i+j);
            //console.log(document.getElementById('s' + i + j));
            setSquare(spaceArray[i + 10 * j], '#');
         }
      }
   }
}
    var clueArray = new Array();
    var clueLets = new Array();
    var clueClear = new Array();

function clearSquare(sq)
{
   if (sq !== undefined && sq.innerHTML != "")
   {
      sq.removeAttribute("style");
      sq.innerHTML = "";
   }
}
function setSquare(sq, a)
{
   if (a == '#')
   {
      clearSquare(sq);
   }
   else
   {
      var blackSq = (a == " ");
      if (blackSq)
      {
         a = "&nbsp";
      }
      if (sq !== undefined &&
          sq.innerHTML !== a)
      {
         sq.style.border = "2px solid black";
         sq.innerHTML = a;
         if (blackSq)
         {
            sq.style.backgroundColor="#000000";
         }
         else
         {
            sq.style.backgroundColor="#ffffff";
         }
      }
   }
}

    function setNext(msg) {
       if(clueArray.length == 0)
       {
          var i;
          var j;
          for (i = 0; i < 4; i++)
          {
             for (j = 0; j < 2; j++)
             {
                clueArray[i + 4 * j] = document.getElementById('grid' + i + j);
             }
          }
       }

       var i;
       var type = msg.substr(5,1);
       switch(type)
       {
       case "0":
          clueLets[0] = clueArray[0];
          clueLets[1] = clueArray[1];
          clueLets[2] = clueArray[2];
          clueLets[3] = clueArray[3];
          clueClear[0] = clueArray[4];
          clueClear[1] = clueArray[5];
          clueClear[2] = clueArray[6];
          clueClear[3] = clueArray[7];
          break;
       case "1":
          clueLets[0] = clueArray[0];
          clueLets[1] = clueArray[1];
          clueLets[2] = clueArray[2];
          clueLets[3] = clueArray[6];
          clueClear[0] = clueArray[3];
          clueClear[1] = clueArray[4];
          clueClear[2] = clueArray[5];
          clueClear[3] = clueArray[7];
          break;
       case "2":
          clueLets[0] = clueArray[0];
          clueLets[1] = clueArray[1];
          clueLets[2] = clueArray[2];
          clueLets[3] = clueArray[4];
          clueClear[0] = clueArray[3];
          clueClear[1] = clueArray[5];
          clueClear[2] = clueArray[6];
          clueClear[3] = clueArray[7];
          break;
       case "3":
          clueLets[0] = clueArray[0];
          clueLets[1] = clueArray[1];
          clueLets[2] = clueArray[4];
          clueLets[3] = clueArray[5];
          clueClear[0] = clueArray[2];
          clueClear[1] = clueArray[3];
          clueClear[2] = clueArray[6];
          clueClear[3] = clueArray[7];
          break;
       case "4":
          clueLets[0] = clueArray[1];
          clueLets[1] = clueArray[2];
          clueLets[2] = clueArray[4];
          clueLets[3] = clueArray[5];
          clueClear[0] = clueArray[0];
          clueClear[1] = clueArray[3];
          clueClear[2] = clueArray[6];
          clueClear[3] = clueArray[7];
          break;
       case "5":
          clueLets[0] = clueArray[0];
          clueLets[1] = clueArray[1];
          clueLets[2] = clueArray[2];
          clueLets[3] = clueArray[5];
          clueClear[0] = clueArray[3];
          clueClear[1] = clueArray[4];
          clueClear[2] = clueArray[6];
          clueClear[3] = clueArray[7];
          break;
       case "6":
          clueLets[0] = clueArray[0];
          clueLets[1] = clueArray[1];
          clueLets[2] = clueArray[5];
          clueLets[3] = clueArray[6];
          clueClear[0] = clueArray[2];
          clueClear[1] = clueArray[3];
          clueClear[2] = clueArray[4];
          clueClear[3] = clueArray[7];
          break;
       }

       for (i = 0; i < clueClear.length; i++)
       {
          clearSquare(clueClear[i]);
       }
       for (i = 0; i < clueLets.length; i++)
       {
          var a = msg.substr(6 + i,1);
          setSquare(clueLets[i], a);
       }
    }

    function bodyLoad() {
      setupKeyboardEvents();
    }
    
    function setupKeyboardEvents()
    {
        document.body.addEventListener("contextmenu", noHandler, true);
        window.addEventListener("contextmenu", noHandler, true);
        document.body.addEventListener("keydown", keyHandler, true);
        document.body.addEventListener("keyup", keyHandler, true);
    }
    
    var macCommandKeyDownLeft = false;
    var macCommandKeyDownRight = false;


function keyHandler(evt)
{
    if(!evt) return false;

    if (evt.keyCode == 91) macCommandKeyDownLeft = (evt.type === "keydown");
    if (evt.keyCode == 93) macCommandKeyDownRight = (evt.type === "keydown");

    if (evt.ctrlKey || evt.altKey) return; // not false since we want propagation
    if (evt.keyCode >= 112 && evt.keyCode <= 123) return; // propagate function keys
    if (macCommandKeyDownLeft || macCommandKeyDownRight) return; // propagate chrome macos command keys

    evt.preventDefault();
    evt.stopPropagation();
    if(evt.stopImmediatePropagation)
        evt.stopImmediatePropagation();

    var msg = evt.type.toUpperCase() + ":";
    msg += evt.keyCode;

    send_nacl_msg(msg);
}
    
    function noHandler(evt)
    {
        if(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
            if(evt.stopImmediatePropagation)
                evt.stopImmediatePropagation();
        }
        return false;
    }
    
    function send_nacl_msg(msg)
    {
        if(naclModule)
            naclModule.postMessage(msg);
    }

    function naclLoad() {
      bodyLoad();
      var bod = document.body;
      bod.onblur = doBlur;
      bod.onfocus = doFocus;
      doFocus();

      naclModule = document.getElementById('nacl-module');
      naclModule.addEventListener('message', naclMessage, false);
      playAud("AUD:6");
      window.onbeforeunload = function() {
        return "Puzzle progress will be lost.";
      };
    }

function naclProgress(e)
{
   if (!e) return;

   if (e.total)
   {
      setClue("CLUE:Load " + Math.floor(100.0 * e.loaded / e.total) + "%");
   }
}

function moduleLoadError() {
   setClue("CLUE:A load error occurred.  Please report this feedback to HQ, including:<br>\"" + navigator.userAgent + '"');
}

function moduleLoadAbort() {
   setClue("CLUE:Load aborted");
}

function doBlur()
{
   macCommandKeyDownLeft = false;
   macCommandKeyDownRight = false;

   send_nacl_msg("PAUSE");
}

function doFocus()
{
   macCommandKeyDownLeft = false;
   macCommandKeyDownRight = false;

   send_nacl_msg("UNPAUSE");
}

    function naclMessage(message_event) {
        updateStatus(message_event.data);
    }
    function updateStatus(opt_message) {
	if (opt_message === null)
	    return;
       if (opt_message.startsWith("HIST:"))
       {
          logHist(opt_message);
       }
       else if (opt_message.startsWith("CLUE:"))
       {
          setClue(opt_message);
       }
       else if (opt_message.startsWith("GRID:"))
       {
          setGrid(opt_message);
       }
       else if (opt_message.startsWith("COLOR:"))
       {
          setColor(opt_message);
       }
       else if (opt_message.startsWith("NEXT:"))
       {
          setNext(opt_message);
       }
       else if (opt_message.startsWith("AUD:"))
       {
          playAud(opt_message);
       }
   }
    
	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function (str){
			return this.indexOf(str) == 0;
		};
	}


// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
      var module = document.getElementById('nacl-module');
      module.addEventListener('progress', naclProgress, true);
      module.addEventListener('load', naclLoad, true);

      module.addEventListener('error', moduleLoadError, true);
      module.addEventListener('abort', moduleLoadAbort, true);
      if (ChromeVersion() === undefined || ChromeVersion() < 31) {
         
         setGrid("GRID:                                                     THIS     PUZZLE   REQUIRES CHROME 31+          google.com/chrome                                                                                   ");
         setClue("CLUE:This puzzle requires Chrome 31 or newer.  Download the latest version at <a href=http://www.google.com/chrome>www.google.com/chrome</a>");
      }
});
