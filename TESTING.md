# 🧪 Testing & Verification Guide

## Complete Testing for Schrödinger's Box Encrypted Chat

This guide provides comprehensive testing procedures to verify the security and functionality of the encrypted communication platform.

---

## ✅ Pre-Testing Checklist

**Verify Services Running:**
```powershell
# Terminal 1: Check backend is running
curl http://localhost:8000/health

# Expected output:
# {"status": "operational", "crypto": "PQC Hybrid Active"}

# Terminal 2: Check frontend loads
# Open http://localhost:5174 in browser
```

---

## 🧪 Test 1: Single User Connection

### Objective
Verify that a single user can establish a secure connection.

### Steps
1. Open http://localhost:5174 in **Browser A**
2. Click "🔐 SECURE CHAT"
3. Wait for status to change from "HANDSHAKING" → "SECURE"

### Expected Results
✅ Status shows "SECURE" (green, pulsing)
✅ Session ID displayed: `session_xxxxxxx`
✅ User ID displayed: `User_xxxxx`
✅ "Share Link" button visible
✅ Message input enabled

### Pass Criteria
- [ ] Connection established within 5 seconds
- [ ] Status indicator is green
- [ ] All UI elements responsive

---

## 🧪 Test 2: Two-User Chat (Same Computer)

### Objective
Verify two users on the same computer can exchange encrypted messages.

### Steps
1. **User A**: Open http://localhost:5174 in **Browser A** (Chrome)
   - Click "🔐 SECURE CHAT"
   - Wait for "SECURE" status
   - Note the Session ID
   - Click "Share Link" button

2. **User B**: Open the copied link in **Browser B** (Firefox/Edge)
   - Different Session ID OR
   - Same Session ID (both should match!)
   - Status should show "SECURE"

3. **User A**: Type message: "Hello from Browser A" → Send
   - Message appears in User A's chat bubble (right side)
   - Combo shows: "COMBO-A"

4. **User B**: Receives message
   - Message appears in User B's chat bubble (left side, different styling)
   - Sender shows: "User_xxxxx" (User A's ID)
   - Same timestamp

5. **User B**: Type reply: "Hello from Browser B" → Send
   - Message appears in User B's bubble (right)
   - Message appears in User A's bubble (left)

### Expected Results
✅ Complete message exchange visible
✅ Messages properly encrypted/decrypted on both ends
✅ No errors or console errors
✅ Timestamps consistent
✅ Algorithm combo displayed correctly
✅ "Encrypted & Authenticated" tooltip appears on hover

### Pass Criteria
- [ ] 3+ messages exchanged successfully
- [ ] No console errors (Right-click → Inspect → Console)
- [ ] Both users see each other's messages
- [ ] Messages are timestamped correctly

---

## 🧪 Test 3: Two-User Chat (Different Computers)

### Objective
Verify P2P encrypted communication across network.

### Steps
1. **Computer A**: Start both backend and frontend
   - Get IP address: `ipconfig` → IPv4 Address (e.g., `192.168.1.x`)
   
2. **Computer A**: Open http://localhost:5174
   - Click "🔐 SECURE CHAT"
   - Click "Share Link" → Copy
   - Send link to Computer B via network/email

3. **Computer B**: Change URL to Computer A's IP
   - `http://192.168.1.x:5174`
   - Open the shared link with session ID

4. **Computer A**: Type "Test message 1" → Send
5. **Computer B**: Receive message → Reply "Test message 2"
6. **Computer A**: Receive reply

### Expected Results
✅ Both computers see the same session
✅ Messages encrypted over network
✅ Perfect P2P communication

### Pass Criteria
- [ ] Messages received on different network
- [ ] No latency issues
- [ ] Encryption working across network boundaries

---

## 🧪 Test 4: Encryption Verification

### Objective
Verify that messages are actually encrypted E2E.

### Steps
1. **Browser A && B**: Connect and establish secure session
2. **Browser A**: Type "SecretMessage123" → Send
3. **Browser A**: Open DevTools (F12) → Network tab
4. **Browser B**: Send another message

### Inspect the Network Data
- Right-click WebSocket in Network tab → Copy as cURL
- Look for the message payload:
  - ❌ **NOT encrypted**: `"content": "SecretMessage123"`
  - ✅ **IS encrypted**: `"ciphertext": "XjF3...==", "iv": "aBc1...=="`

### Expected Results
✅ Raw message never appears in network traffic
✅ Only base64-encoded ciphertext visible
✅ IV changes for every message (randomness proof)

### Pass Criteria
- [ ] No plaintext visible in browser DevTools
- [ ] Each message has unique IV (proven randomness)
- [ ] Ciphertext length consistent (~base64 of AES output + tag)

---

## 🧪 Test 5: Algorithm Combination Testing

### Objective
Verify different PQC combinations work and are listed properly.

### Steps
1. **Browser A**: Open Chat → Dropdown shows all combos:
   - COMBO-A (Level 1)
   - COMBO-B (Level 2)
   - COMBO-C (Level 3)
   - COMBO-D (Level 4)
   - COMBO-E (Level 5)

2. Select **COMBO-C** → Send message "Testing COMBO-C"
3. Message bubble shows "COMBO-C"
4. Switch to **COMBO-E** → Send message "Testing COMBO-E"
5. See different combo labels on different messages

### Expected Results
✅ All 5 combos available in dropdown
✅ Combo changes apply to new messages only
✅ Each message labeled with its combo
✅ No errors switching combos

### Pass Criteria
- [ ] Dropdown functional
- [ ] All 5 combos selectable
- [ ] Combo label matches selected combo
- [ ] Encryption works for all combos

---

## 🧪 Test 6: Error Handling & Recovery

### Objective
Verify graceful error handling and reconnection.

### Steps
1. **Browser A & B**: Establish connection (SECURE)
2. **Terminal (Backend)**: Press Ctrl+C to stop backend
   - Wait 10 seconds
3. **Browser A**: Try to send message
   - Should show error (red alert)
4. **Terminal (Backend)**: Restart with `uvicorn main:app --reload --port 8000`
   - Wait 10 seconds
5. **Browser A**: Try to send message again
   - Should reconnect automatically
   - Status changes back to SECURE

### Expected Results
✅ Error message displayed clearly
✅ Automatic reconnection attempt
✅ Status recovers after backend restart
✅ Messages resume flowing

### Pass Criteria
- [ ] Error message appears (red banner)
- [ ] Auto-reconnect triggered
- [ ] No manual refresh needed
- [ ] Chat recovers within 5 seconds

---

## 🧪 Test 7: Concurrent Multi-User (3+ Users)

### Objective
Verify chat works with multiple simultaneous users.

### Steps
1. Open 3+ browser windows (or incognito windows)
2. Each opens http://localhost:5174/chat
3. Share the same session link OR let each generate their own
4. **User A**: "Hello from A" → Send
5. **User B**: "Hello from B" → Send  
6. **User C**: "Hello from C" → Send
7. All three should see all three messages

### Expected Results
✅ All users receive all messages
✅ Sender identification correct
✅ No message loss
✅ No duplicate messages

### Pass Criteria
- [ ] 3+ users can communicate simultaneously
- [ ] No message loss at scale
- [ ] All users see consistent message order

---

## 🧪 Test 8: Long Message Testing

### Objective
Verify encryption works for messages of varying lengths.

### Steps
1. **Browser A & B**: Connect
2. **Browser A**: Send short message: "Hi"
3. **Browser B**: Receive → Reply: "Hi back"
4. **Browser A**: Send medium: "This is a medium length message about encryption testing"
5. **Browser B**: Send long: (copy-paste a long paragraph)
6. **Browser A**: Send very long: (entire page of Lorem Ipsum text)

### Expected Results
✅ Short messages: ~100 bytes ciphertext
✅ Medium messages: ~200-300 bytes
✅ Long messages: correctly sized (plaintext * 1.33 + 48 bytes)
✅ All receivable and readable

### Pass Criteria
- [ ] Messages 1-100 characters work
- [ ] Messages 100-1000 characters work
- [ ] Messages 1000-10000 characters work
- [ ] No truncation or corruption

---

## 🧪 Test 9: Special Characters & Unicode

### Objective
Verify encryption handles all character types.

### Steps
1. **Browser A & B**: Connect
2. **Browser A**: Send emoji: "🔐 🗝️ 🚀 ✅"
3. **Browser B**: Receive & verify emojis correct
4. **Browser A**: Send Chinese: "你好，我是加密聊天"
5. **Browser B**: Verify Chinese characters
6. **Browser A**: Send special: "!@#$%^&*(){}[]|\\:;\"'<>/?"
7. **Browser B**: Verify all special chars

### Expected Results
✅ All unicode characters preserved
✅ Emoji render correctly
✅ No character corruption
✅ All languages supported

### Pass Criteria
- [ ] Emoji messages work
- [ ] Non-ASCII characters work
- [ ] Special characters work
- [ ] All received as transmitted

---

## 🧪 Test 10: UI/UX & Responsiveness

### Objective
Verify the interface is intuitive and responsive.

### Steps
1. **Browser A & B**: Connect
2. Verify **visual feedback**:
   - Spinner during HANDSHAKING
   - Green light when SECURE
   - Disabled input when not SECURE
3. Verify **message display**:
   - Your messages: right side, blue-ish bubble
   - Others' messages: left side, white-ish bubble
   - Different styling for clarity
4. Verify **timestamps**:
   - Hover over message → Shows exact time
   - Format: HH:MM:SS
5. Verify **smooth scroll**:
   - New message appears at bottom
   - Chat auto-scrolls
   - Manual scroll doesn't interrupt
6. Verify **responsive input**:
   - Type while receiving messages
   - Send button disables when input empty
   - Enter key works for sending

### Expected Results
✅ Clear visual distinction between users
✅ Intuitive UI elements
✅ No layout shifts
✅ Smooth animations

### Pass Criteria
- [ ] UI is professional and clear
- [ ] Animations are smooth (60 FPS)
- [ ] All interactive elements work
- [ ] Mobile-friendly (test on phone)

---

## 🧪 Test 11: Browser Console (Security Check)

### Objective
Verify no sensitive data logged to console (SOP compliance).

### Steps
1. **Browser A & B**: Connect and chat normally
2. Open DevTools (F12) → Console tab
3. Filter for errors/warnings
4. Check Network tab for message contents

### Expected Results
✅ No plaintext messages in console
✅ No decrypted content in console
✅ Session key not exposed
✅ Only application logs visible

### Pass Criteria
- [ ] Console clean (no sensitive data)
- [ ] Network traffic is encrypted
- [ ] No keys/secrets visible anywhere

---

## 🧪 Test 12: Load Test (Optional)

### Objective
Verify system handles multiple rapid messages.

### Steps
1. **Browser A & B**: Connect
2. **Browser A**: Rapidly send 20 messages (1 per second):
   ```
   "Message 1"
   "Message 2"
   ...
   "Message 20"
   ```
3. **Browser B**: Verify all 20 received and in order

### Expected Results
✅ All messages received
✅ Correct ordering maintained
✅ No message loss at load
✅ No performance degradation

### Pass Criteria
- [ ] 20+ messages handled
- [ ] Messages in correct order
- [ ] No lag or timeouts
- [ ] System remains responsive

---

## 🧪 Test 13: Session Switching

### Objective
Verify users can switch between multiple encrypted sessions.

### Steps
1. **Browser A**: Session 1 → Click URL
   - Read session ID from URL: `?session=session_abc123`
2. **Browser A**: Manually change to Session 2 URL:
   - `http://localhost:5174?session=session_xyz789`
3. **Browser A**: Wait for "SECURE"
4. Message in Session 2 (should be empty, new session)
5. **Browser A**: Return to Session 1 URL
6. **Verify**: Previous messages still there

### Expected Results
✅ Sessions properly isolated
✅ Messages persist per session
✅ Can switch between sessions
✅ No message leakage

### Pass Criteria
- [ ] Session 1 and 2 are separate
- [ ] Can switch between them
- [ ] History preserved per session

---

## 📋 Automated Test Checklist

### Quick Verification (5 minutes)
- [ ] Backend API health: `curl http://localhost:8000/health`
- [ ] Frontend loads: http://localhost:5174
- [ ] Two browsers connect to same session
- [ ] Messages exchange successfully
- [ ] UI looks good

### Standard Testing (30 minutes)
- [ ] Tests 1-7 complete
- [ ] All critical features verified
- [ ] No console errors
- [ ] Error handling works

### Comprehensive Testing (2 hours)
- [ ] All 13 tests complete
- [ ] Edge cases covered
- [ ] Performance verified
- [ ] Security audit done
- [ ] Documentation updated

---

## 🐛 Debugging Commands

### Backend Logs
```bash
# From backend directory
tail -f logs.txt
# or real-time output from running process
```

### Frontend DevTools
```javascript
// In browser console, test encryption
const msg = "test";
// Verify crypto functions loaded
console.log(typeof encryptMessage); // should be "function"
```

### Network Inspection
```bash
# tcpdump to see network traffic (requires sudo)
sudo tcpdump -i lo port 8000 -A
```

---

## 📊 Test Results Template

```markdown
# Test Results - [DATE]

## Environment
- Backend: Python 3.13, FastAPI
- Frontend: React 19, Vite
- Browser: Chrome 120, Firefox 121
- OS: Windows, macOS, Linux

## Test Results
| Test | Status | Notes |
|------|--------|-------|
| Single User Connect | ✅ PASS | Connected in 2.3s |
| Two User Chat | ✅ PASS | 5 messages exchanged |
| Encryption | ✅ PASS | No plaintext in network |
| Error Recovery | ✅ PASS | Reconnected automatically |

## Issues Found
- None

## Recommendations
- Performance is excellent
- Security verified
- Recommend for production
```

---

## 🎯 Final Verification Before Production

After all tests pass:

1. ✅ Code review completed
2. ✅ Security audit passed
3. ✅ All 13 tests passed
4. ✅ Performance meets requirements
5. ✅ Documentation complete
6. ✅ Deployment guide reviewed
7. ✅ Ready for production 🚀

---

## 📞 Support

If tests fail:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review console errors (F12)
3. Restart both backend and frontend
4. Verify `.env` variables
5. Check firewall/antivirus blocking ports

**Questions?** See [README.md](./README.md) or review [DEPLOYMENT.md](./DEPLOYMENT.md)
