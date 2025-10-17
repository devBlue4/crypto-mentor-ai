/**
 * Data export service for portfolio, transactions, and analysis data
 */

export const exportService = {
  /**
   * Export portfolio data to CSV
   * @param {Object} portfolioData - Portfolio data to export
   * @param {string} filename - Optional filename
   */
  exportPortfolioToCSV(portfolioData, filename = 'portfolio') {
    const { tokens, totalValue, analysis } = portfolioData
    
    const csvHeaders = [
      'Token',
      'Symbol',
      'Balance',
      'Price (USD)',
      'Value (USD)',
      'Percentage',
      'Address'
    ]
    
    const csvRows = [csvHeaders.join(',')]
    
    tokens.forEach(token => {
      const row = [
        `"${token.name || ''}"`,
        `"${token.symbol}"`,
        token.balance,
        token.price_usd || 0,
        (parseFloat(token.balance) * (token.price_usd || 0)).toFixed(2),
        ((parseFloat(token.balance) * (token.price_usd || 0)) / totalValue * 100).toFixed(2),
        `"${token.address || ''}"`
      ]
      csvRows.push(row.join(','))
    })
    
    // Add summary row
    csvRows.push('')
    csvRows.push('Total Value (USD),' + totalValue.toFixed(2))
    if (analysis) {
      csvRows.push('Risk Level,' + (analysis.risk_level || 'N/A'))
      csvRows.push('Diversity Score,' + (analysis.diversity_score || 'N/A'))
    }
    
    this.downloadFile(csvRows.join('\n'), `${filename}_${this.getCurrentDate()}.csv`, 'text/csv')
  },

  /**
   * Export transaction history to CSV
   * @param {Array} transactions - Array of transaction objects
   * @param {string} filename - Optional filename
   */
  exportTransactionsToCSV(transactions, filename = 'transactions') {
    const csvHeaders = [
      'Date',
      'Type',
      'Token',
      'Amount',
      'Price (USD)',
      'Total Value (USD)',
      'Transaction Hash',
      'Status'
    ]
    
    const csvRows = [csvHeaders.join(',')]
    
    transactions.forEach(tx => {
      const row = [
        `"${new Date(tx.timestamp).toLocaleDateString()}"`,
        `"${tx.type}"`,
        `"${tx.token}"`,
        tx.amount,
        tx.price_usd || 0,
        (parseFloat(tx.amount) * (tx.price_usd || 0)).toFixed(2),
        `"${tx.hash || ''}"`,
        `"${tx.status || 'confirmed'}"`
      ]
      csvRows.push(row.join(','))
    })
    
    this.downloadFile(csvRows.join('\n'), `${filename}_${this.getCurrentDate()}.csv`, 'text/csv')
  },

  /**
   * Export market analysis to CSV
   * @param {Object} analysisData - Market analysis data
   * @param {string} filename - Optional filename
   */
  exportAnalysisToCSV(analysisData, filename = 'market_analysis') {
    const { overview, insights, recommendations } = analysisData
    
    const csvRows = []
    
    // Market Overview
    csvRows.push('Market Overview')
    csvRows.push('Metric,Value')
    csvRows.push(`Total Market Cap,${overview.totalMarketCap || 'N/A'}`)
    csvRows.push(`Total Volume,${overview.totalVolume || 'N/A'}`)
    csvRows.push(`Fear & Greed Index,${overview.fearGreedIndex || 'N/A'}`)
    csvRows.push(`Bitcoin Dominance,${overview.dominance?.bitcoin || 'N/A'}%`)
    csvRows.push(`Ethereum Dominance,${overview.dominance?.ethereum || 'N/A'}%`)
    csvRows.push('')
    
    // Top Performers
    if (overview.top_performers && overview.top_performers.length > 0) {
      csvRows.push('Top Performers')
      csvRows.push('Symbol,Price (USD),Change 24h (%)')
      overview.top_performers.forEach(coin => {
        csvRows.push(`"${coin.symbol}",${coin.price},${coin.change_24h}`)
      })
      csvRows.push('')
    }
    
    // Insights
    if (insights && insights.length > 0) {
      csvRows.push('Market Insights')
      insights.forEach((insight, index) => {
        csvRows.push(`"${index + 1}. ${insight}"`)
      })
      csvRows.push('')
    }
    
    // Recommendations
    if (recommendations && recommendations.length > 0) {
      csvRows.push('Recommendations')
      recommendations.forEach((rec, index) => {
        csvRows.push(`"${index + 1}. ${rec}"`)
      })
    }
    
    this.downloadFile(csvRows.join('\n'), `${filename}_${this.getCurrentDate()}.csv`, 'text/csv')
  },

  /**
   * Export data to JSON
   * @param {Object} data - Data to export
   * @param {string} filename - Optional filename
   */
  exportToJSON(data, filename = 'data') {
    const jsonString = JSON.stringify(data, null, 2)
    this.downloadFile(jsonString, `${filename}_${this.getCurrentDate()}.json`, 'application/json')
  },

  /**
   * Export portfolio to PDF (simplified HTML to PDF)
   * @param {Object} portfolioData - Portfolio data
   * @param {string} filename - Optional filename
   */
  exportPortfolioToPDF(portfolioData, filename = 'portfolio') {
    const { tokens, totalValue, analysis } = portfolioData
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Portfolio Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; }
            h2 { color: #374151; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .summary { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 50px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>Portfolio Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <div class="summary">
            <h2>Portfolio Summary</h2>
            <p><strong>Total Value:</strong> $${totalValue.toFixed(2)}</p>
            ${analysis ? `
              <p><strong>Risk Level:</strong> ${analysis.risk_level || 'N/A'}</p>
              <p><strong>Diversity Score:</strong> ${analysis.diversity_score || 'N/A'}</p>
            ` : ''}
          </div>
          
          <h2>Token Holdings</h2>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Symbol</th>
                <th>Balance</th>
                <th>Price (USD)</th>
                <th>Value (USD)</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${tokens.map(token => `
                <tr>
                  <td>${token.name || ''}</td>
                  <td>${token.symbol}</td>
                  <td>${token.balance}</td>
                  <td>$${token.price_usd || 0}</td>
                  <td>$${(parseFloat(token.balance) * (token.price_usd || 0)).toFixed(2)}</td>
                  <td>${((parseFloat(token.balance) * (token.price_usd || 0)) / totalValue * 100).toFixed(2)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Report generated by CryptoMentor AI</p>
          </div>
        </body>
      </html>
    `
    
    this.downloadFile(html, `${filename}_${this.getCurrentDate()}.html`, 'text/html')
  },

  /**
   * Download file to user's device
   * @param {string} content - File content
   * @param {string} filename - Filename
   * @param {string} mimeType - MIME type
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  },

  /**
   * Get current date in YYYY-MM-DD format
   * @returns {string} Current date
   */
  getCurrentDate() {
    return new Date().toISOString().split('T')[0]
  },

  /**
   * Export all data (portfolio, transactions, analysis) as a zip
   * @param {Object} allData - All data to export
   * @param {string} filename - Optional filename
   */
  async exportAllData(allData, filename = 'crypto_mentor_data') {
    // This would require a zip library like JSZip
    // For now, we'll export as separate files
    const { portfolio, transactions, analysis } = allData
    
    if (portfolio) {
      this.exportPortfolioToCSV(portfolio, `${filename}_portfolio`)
    }
    
    if (transactions && transactions.length > 0) {
      this.exportTransactionsToCSV(transactions, `${filename}_transactions`)
    }
    
    if (analysis) {
      this.exportAnalysisToCSV(analysis, `${filename}_analysis`)
    }
  }
}

export default exportService







