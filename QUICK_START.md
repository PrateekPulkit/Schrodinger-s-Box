# 🚀 QUICK START - Run Encrypted Chat Locally

## Start Schrödinger's Box in 30 Seconds

### Prerequisites ✅
- Python 3.13+ installed
- Node.js 18+ installed
- Both services already set up (dependencies installed, models trained)

---

## 🎯 The Easiest Setup

### Terminal 1 - Backend
```powershell
cd "schrodingers-box\backend"
./venv/Scripts/python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 - Frontend
```powershell
cd "schrodingers-box\frontend"
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms
→ Local:   http://localhost:5174/
```

---

## 🔗 Next Steps

### Step 1: Open First Browser
- Click: http://localhost:5174
- Click: "🔐 SECURE CHAT"
- Wait until status shows: **SECURE** ✓

### Step 2: Open Second Browser (or New Window)
- In **Chrome**: http://localhost:5174
- Paste the session link OR open new window with same URL
- Status should also show: **SECURE** ✓

### Step 3: Start Chatting!
1. **Browser 1**: Type "Hello" → Send
2. **Browser 2**: Receives "Hello" (encrypted!)
3. **Browser 2**: Type reply → Send
4. **Browser 1**: Receives reply

**That's it! You're now communicating with post-quantum encryption! 🔐**

---

## 🧪 Verify It's Working

### Visual Checks
- ✅ Both browsers show green "SECURE" indicator
- ✅ Messages appear instantly
- ✅ Different bubbles for each user
- ✅ Hover over message shows "Encrypted & Authenticated"

### Network Verification (Optional)
1. Open DevTools (F12) → Network tab
2. Look for WebSocket messages
3. Message content shows as base64 (encrypted)
4. Never shows plaintext

---

## 🤔 Troubleshooting

### Backend won't start
```powershell
# Make sure you're in the right directory
cd schrodingers-box\backend

# Check Python version
python --version  # Should be 3.11+

# Check virtual environment exists
./venv/Scripts/python --version  # Should work

# If not, recreate venv
python -m venv venv
./venv/Scripts/pip install -r requirements.txt

# Then try again
./venv/Scripts/python -m uvicorn main:app --reload --port 8000
```

### Frontend won't start
```powershell
# Make sure you're in the right directory
cd schrodingers-box\frontend

# Check npm works
npm --version  # Should show version

# Install dependencies if needed
npm install

# Then try dev
npm run dev
```

### Port 8000 or 5174 already in use
```powershell
# Find what's using port 8000
netstat -ano | findstr ":8000"

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different ports
uvicorn main:app --port 8001  # Backend on 8001
npm run dev -- --port 5175     # Frontend on 5175
```

### Messages not showing
1. Check browser console (F12 → Console)
2. Look for error messages in red
3. Check Network tab for WebSocket errors
4. Verify backend is running and responding

---

## 🔐 How Encryption Works

```
Your Message: "Hello"
       ↓
[Encrypt with AES-256-GCM on YOUR computer]
       ↓
Encrypted bytes sent to server
       ↓
Server CAN'T READ IT (it's encrypted E2E)
       ↓
Server forwards to other user
       ↓
[Decrypt with AES-256-GCM on THEIR computer]
       ↓
They see: "Hello"
```

**Key Point**: The server never sees or can read your messages!

---

## 📊 What Gets Encrypted

✅ **Message content** - What you type
✅ **Message timestamps** - When sent
✅ **User identity** - Who you are
✅ **Algorithm choice** - Which PQC combo
✅ **In-flight transmission** - While going to server

❌ **Not encrypted** (already secure on network):
- Server IP/Port (HTTPS)
- Session ID (transmitted over encrypted connection)
- Browser metadata (handled by HTTPS)

---

## 🎯 Testing Checklist

After starting services, verify:

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5174
- [ ] Can access http://localhost:8000/docs (API docs)
- [ ] Can see health check: http://localhost:8000/health
- [ ] Two browsers can connect
- [ ] Messages transmit between browsers
- [ ] Status shows "SECURE" (green)
- [ ] Hover shows "Encrypted & Authenticated"

---

## 💡 Next: Production Deployment

When ready to share with others, see:
→ [DEPLOYMENT.md](./DEPLOYMENT.md)

**Key Steps to Deploy:**
1. Push code to GitHub
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Share the frontend URL with others
5. Users click link → Start chatting securely!

---

## 🎓 Learning Resources

- **How encryption works**: See [TESTING.md](./TESTING.md) → Test 4
- **API documentation**: http://localhost:8000/docs (when running)
- **Source code**: See main.py, Chat.tsx, useWebSocket.ts
- **Full setup guide**: [SETUP_COMPLETE.md](./SETUP_COMPLETE.md)
- **Production guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## ⚡ Pro Tips

**Tip 1: Share Encrypted Chats**
- Click "Share Link" button
- Send link to anyone
- They click → Join same encrypted session

**Tip 2: Switch Encryption Algorithm**
- Open dropdown in chat header
- Select COMBO-A through COMBO-E
- Each combo uses different PQC algorithms

**Tip 3: Keep Terminal Window Open**
- Both terminal windows must stay running
- Minimizing is fine, closing stops services
- Ctrl+C to stop gracefully

**Tip 4: Test on Phone**
- Use IP address instead of localhost
- Example: `http://192.168.1.x:5174`
- Same encryption on any device!

---

## 🎉 You're All Set!

```
✅ Services running
✅ Encryption working
✅ Multi-user chat enabled
✅ Ready to communicate securely!
```

**Start chatting now** → http://localhost:5174

---

## 📞 Still Need Help?

1. **It won't start?** → See Troubleshooting section above
2. **Messages not working?** → Check browser console (F12)
3. **Want to deploy?** → Review [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Want to test thoroughly?** → Follow [TESTING.md](./TESTING.md)
5. **Want full setup info?** → See [SETUP_COMPLETE.md](./SETUP_COMPLETE.md)

---

**Happy Encrypted Chatting! 🔐**

*Last verified: March 24, 2026*
