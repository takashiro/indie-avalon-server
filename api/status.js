
function GET() {
	let lobby = this.getLobby();
	return lobby.getStatus();
}

module.exports = {
	GET
};
