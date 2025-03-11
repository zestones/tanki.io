# Tank Game Load Testing Module

This module provides a structured way to load test the Tank Game with multiple simultaneous players, simulating movement and shooting actions.

## Installation

```bash
cd tests    # Navigate to the tests directory
npm install # Install dependencies
```

## Running Tests

The test module provides several predefined test scenarios:

```bash
# Default test with 10 players for 60 seconds
npm test


npm run test:aggressive # Test with aggressive behavior (players move more and shoot more frequently)
npm run test:50         # Test with 50 players to simulate high load
npm run test:short      # Short test run (30 seconds) for quick feedback
npm run test:monitor    # Extended monitoring test (20 players for 5 minutes)
```

## Custom Test Configuration

You can customize the test behavior by passing command-line arguments:

```bash
# Example: 15 players with aggressive behavior for 2 minutes on a staging server
npm run test -- --players=15 --behavior=aggressive --duration=120 --server=ws://<ip-address>:3000

# Available parameters:
# --players=N         Number of simulated players (default: 10)
# --behavior=TYPE     Player behavior: 'random' or 'aggressive' (default: random)
# --duration=N        Test duration in seconds (default: 60)
# --server=URL        WebSocket server URL (default: ws://localhost:3000)
# --room=NAME         Room name to join (default: game)
# --delay=N           Delay between player connections in ms (default: 100)
```

## Test Behaviors

The test module includes different player behaviors:

- **Random Movement**: Players move in random directions and shoot occasionally
- **Aggressive**: Players move more frequently and shoot more often

## Understanding Test Output

The test displays information about:

- Test configuration (server, number of players, duration)
- Connection status for each player
- Test progress and completion
- Summary of test results

Example output:

```plaintext
==================================================
TANK GAME LOAD TEST
==================================================
Server: ws://localhost:3000
Players: 10
Duration: 60 seconds
--------------------------------------------------
Test started at: 2023-03-11T01:45:30.123Z
--------------------------------------------------
[2023-03-11T01:45:30.456Z] [INFO] [PlayerManager] Connecting 10 players to ws://localhost:3000
[2023-03-11T01:45:30.789Z] [DEBUG] [PlayerManager] Player 1 connected
...
[2023-03-11T01:45:32.123Z] [INFO] [PlayerManager] Connected 10 players
...
[2023-03-11T01:46:30.456Z] [INFO] [PlayerManager] Disconnecting all players
--------------------------------------------------
Test results:
Test duration: 60.00 seconds
Connected players: 10
--------------------------------------------------
Test ended at: 2023-03-11T01:46:30.789Z
==================================================
```

## Project Structure

```plaintext
tests/
├── src/
│   ├── behaviors/       # Player behavior patterns
│   ├── config/          # Test configuration
│   ├── core/            # Core test functionality
│   ├── reporting/       # Test reporting
│   └── utils/           # Utilities
├── index.js             # Main entry point
└── package.json         # Dependencies and scripts
```

## Extending the Tests

To create a new player behavior:

1. Create a new file in `src/behaviors/`
2. Extend the `BaseBehavior` class
3. Implement the `start` method
4. Update the index.js to include your new behavior

## Troubleshooting

If you encounter connection issues:

- Ensure the game server is running
- Check the server URL is correct
- Verify the WebSocket port is open and accessible
- Reduce the number of players if the server is overloaded
