# Troubleshooting - CryptoMentor AI

This guide will help you resolve common issues that may arise when using CryptoMentor AI.

## 🚨 Critical Issues

### Application doesn't load / White screen

**Symptoms:**
- Completely white screen
- Console shows errors
- Application not responding

**Diagnosis:**
1. Open developer tools (F12)
2. Go to "Console" tab
3. Look for errors in red

**Solutions:**

#### Error: "Cannot read properties of undefined"
```javascript
// Problem: Accessing properties of undefined objects
// Solution: Add checks
const data = marketData?.property || defaultValue
```

#### Error: "Module not found"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Port 3000 is already in use"
```bash
# Solution: Use different port
npm run dev -- --port 3001
```

### MetaMask won't connect

**Symptoms:**
- "Connect Wallet" button doesn't work
- "MetaMask not found" error
- Connection fails repeatedly

**Diagnosis:**
```javascript
// Check in browser console
console.log(typeof window.ethereum) // Should show "object"
```

**Solutions:**

#### MetaMask not installed
1. Go to [metamask.io](https://metamask.io/download/)
2. Download the extension for your browser
3. Create a new wallet or import an existing one
4. Reload the page

#### MetaMask not unlocked
1. Click on the MetaMask icon
2. Enter your password
3. Make sure it's unlocked
4. Try connecting again

#### Wrong network
1. Open MetaMask
2. Verify you're on the correct network
3. Switch to Ethereum Mainnet or Goerli Testnet
4. Reload the application

#### Permissions denied
1. Go to MetaMask settings
2. Revoke permissions for the site
3. Reload the page
4. Connect again and accept permissions

### AURA not responding

**Symptoms:**
- Chat doesn't send messages
- Infinite "typing" indicator
- "Failed to send message" error

**Diagnosis:**
```javascript
// Check API key in console
console.log(import.meta.env.VITE_AURA_API_KEY) // Should show your key
```

**Solutions:**

#### No API key
1. Verify you have a `.env` file
2. Add your AURA API key:
   ```env
   VITE_AURA_API_KEY=your_api_key_here
   ```
3. Restart the development server

#### Invalid API key
1. Verify the API key is correct
2. Confirm it doesn't have extra spaces
3. Regenerate the API key if necessary
4. Update the `.env` file

#### Rate limit exceeded
1. Wait a few minutes
2. Reduce message frequency
3. Contact support if it persists

#### No internet connection
1. Check your connection
2. Try other websites
3. Restart your router if necessary

## 💻 Development Issues

### Compilation errors

**Error: "Cannot resolve dependency"**
```bash
# Solution
npm install
# Or specifically
npm install package-name
```

**Error: "ESLint errors"**
```bash
# View errors
npm run lint

# Fix automatically
npm run lint:fix
```

**Error: "TypeScript errors"**
```bash
# Check types
npx tsc --noEmit

# Install missing types
npm install --save-dev @types/package-name
```

### Build issues

**Error: "Build failed"**
```bash
# Clean previous build
rm -rf dist

# Reinstall dependencies
rm -rf node_modules
npm install

# Build again
npm run build
```

**Error: "Out of memory"**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Hot reload issues

**Changes not reflected:**
1. Verify the server is running
2. Manually reload the page
3. Restart the development server
4. Clear browser cache

## 🌐 Network and API Issues

### APIs not responding

**CoinGecko API:**
```javascript
// Check in console
fetch('https://api.coingecko.com/api/v3/ping')
  .then(response => response.json())
  .then(data => console.log(data))
```

**Solutions:**
1. Check your internet connection
2. Wait a few minutes (rate limiting)
3. Verify that APIs are working
4. Use API keys if you have limits

### Data not updating

**Portfolio not updating:**
1. Click "Update" in the portfolio
2. Disconnect and reconnect the wallet
3. Verify you're on the correct network
4. Reload the page

**Outdated prices:**
1. Prices update every 30 seconds
2. Use the "Update" button to force update
3. Verify that price APIs are working

## 📱 Browser Issues

### Chrome

**Conflicting extensions:**
1. Temporarily disable extensions
2. Use incognito mode to test
3. Identify the problematic extension
4. Configure exceptions if necessary

**Corrupted cache:**
1. Press Ctrl+Shift+R (hard refresh)
2. Go to Settings > Privacy > Clear data
3. Select "Images and cached files"
4. Click "Clear data"

### Firefox

**Performance issues:**
1. Disable unnecessary extensions
2. Restart Firefox
3. Use safe mode to test
4. Update Firefox to the latest version

### Safari

**Compatibility issues:**
1. Update Safari to the latest version
2. Enable JavaScript
3. Disable content blockers
4. Clear cache and cookies

### Edge

**Web3 issues:**
1. Update Edge to the latest version
2. Verify MetaMask is installed
3. Enable extensions in private mode
4. Restart the browser

## 🔧 Wallet Issues

### Transactions fail

**Error: "Insufficient funds"**
1. Verify you have enough ETH for gas
2. Reduce gas limit if possible
3. Increase gas price if network is congested

**Error: "Transaction rejected"**
1. Make sure to confirm in MetaMask
2. Verify parameters are correct
3. Don't cancel the transaction

**Error: "Nonce too low"**
1. Wait for the previous transaction to confirm
2. Restart MetaMask
3. Use a new account if it persists

### Incorrect balance

**Balance not updating:**
1. Wait a few minutes for confirmation
2. Verify the transaction in the explorer
3. Reload the page
4. Update MetaMask

**Tokens not appearing:**
1. Add the token manually in MetaMask
2. Verify you're using the correct contract address
3. Confirm the token is ERC-20

## 🎨 UI/UX Issues

### Broken design

**Styles not loading:**
1. Verify TailwindCSS is installed
2. Check PostCSS configuration
3. Clear browser cache
4. Restart the development server

**Components not rendering:**
1. Check for errors in console
2. Review component imports
3. Confirm props are correct
4. Use React DevTools for debugging

### Responsiveness

**Design not adapting:**
1. Verify TailwindCSS breakpoints
2. Use developer tools to test
3. Review custom CSS
4. Confirm viewport meta tag

## 📊 Data Issues

### Charts not loading

**Recharts not rendering:**
1. Verify data is in correct format
2. Confirm ResponsiveContainer has dimensions
3. Check for errors in console
4. Update Recharts if necessary

**Missing data:**
1. Verify APIs are responding
2. Confirm data has expected structure
3. Add fallback data
4. Review loading state handling

### Incorrect calculations

**Portfolio values:**
1. Verify token prices
2. Confirm unit conversions
3. Review calculation formulas
4. Update data manually

## 🔒 Security Issues

### Security warnings

**"Not secure" in browser:**
1. Use HTTPS in production
2. Verify SSL certificates
3. Don't use HTTP for sensitive data

**MetaMask warnings:**
1. Read warnings carefully
2. Verify contract addresses
3. Don't share private keys
4. Use only trusted sites

### Validations fail

**Invalid addresses:**
```javascript
// Check format
ethers.isAddress(address) // Should return true
```

**Invalid amounts:**
```javascript
// Check numeric format
const amount = parseFloat(input)
if (isNaN(amount) || amount <= 0) {
  throw new Error('Invalid amount')
}
```

## 🚀 Performance Issues

### Slow application

**Diagnosis:**
1. Open developer tools
2. Go to "Performance" tab
3. Record a usage session
4. Identify bottlenecks

**Solutions:**
1. Optimize images and assets
2. Implement lazy loading
3. Use React.memo for components
4. Optimize re-renders

### High memory

**Identify memory leaks:**
1. Use profiling tools
2. Check for unremoved event listeners
3. Confirm useEffect cleanup
4. Review circular references

## 📝 Logging and Debugging

### Enable detailed logs

```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### Use React DevTools

1. Install React DevTools extension
2. Inspect components
3. Review props and state
4. Identify unnecessary re-renders

### Network debugging

1. Open developer tools
2. Go to "Network" tab
3. Review failed requests
4. Verify headers and responses

## 🆘 When to Contact Support

### Contact support if:

- **Critical errors** that prevent usage
- **Data loss** or transactions
- **Security issues** that are suspicious
- **Reproducible bugs** with clear steps

### Information to include:

1. **Problem description**
2. **Steps to reproduce**
3. **Screenshots**
4. **Console logs**
5. **Browser and version**
6. **Operating system**

### Support channels:

- **Email**: support@cryptomentor.ai
- **Discord**: [Community](https://discord.gg/cryptomentor)
- **GitHub**: [Issues](https://github.com/your-username/crypto-mentor-ai/issues)

## 🔧 Debugging Tools

### Useful extensions:

- **React Developer Tools**
- **Redux DevTools** (if using Redux)
- **MetaMask**
- **Web3 Developer Tools**

### Useful commands:

```bash
# Check dependencies
npm audit

# Clear cache
npm cache clean --force

# Check versions
npm outdated

# Debug mode
DEBUG=* npm run dev
```

### Utility scripts:

```bash
# Check configuration
npm run setup

# Clean build
npm run clean

# Check linting
npm run lint

# Tests
npm test
```

---

If you continue to have issues after reviewing this guide, don't hesitate to contact support with all relevant information. 🚀
