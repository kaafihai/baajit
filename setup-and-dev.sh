
#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Nix + Tauri Development Setup ===${NC}"

# Check if Nix is already installed
if command -v nix &> /dev/null; then
    echo -e "${YELLOW}Nix is already installed!${NC}"
    nix --version
else
    echo -e "${GREEN}Installing Nix...${NC}"
    
    # Install Nix using the Determinate Nix Installer (recommended for macOS)
    # This installer handles macOS-specific setup better than the official installer
    curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
    
    # Source Nix
    if [ -e '/nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh' ]; then
        . '/nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh'
    fi
    
    echo -e "${GREEN}Nix installed successfully!${NC}"
    nix --version
fi

# Ensure Nix is in PATH for this session
if [ -e '/nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh' ]; then
    . '/nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh'
fi

# Verify Nix is available
if ! command -v nix &> /dev/null; then
    echo -e "${RED}Error: Nix installation failed or not in PATH${NC}"
    echo -e "${YELLOW}Please restart your terminal and run this script again${NC}"
    exit 1
fi

# Enable experimental features if not already enabled
echo -e "${GREEN}Configuring Nix...${NC}"
mkdir -p ~/.config/nix
if ! grep -q "experimental-features" ~/.config/nix/nix.conf 2>/dev/null; then
    echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
    echo -e "${GREEN}Enabled Nix flakes and commands${NC}"
fi

# Check if flake.nix exists in current directory
if [ ! -f "flake.nix" ]; then
    echo -e "${RED}Error: flake.nix not found in current directory${NC}"
    echo -e "${YELLOW}Please run this script from your project root directory${NC}"
    exit 1
fi

echo -e "${GREEN}Starting development environment...${NC}"

# Enter the Nix development shell and run pnpm tauri dev
# Using --command to execute the command inside the nix develop shell
nix develop --command bash -c "
    echo -e '${GREEN}Inside Nix development environment${NC}'
    echo -e '${GREEN}Running: pnpm tauri dev${NC}'
    pnpm tauri dev
"

echo -e "${GREEN}=== Setup Complete ===${NC}"
