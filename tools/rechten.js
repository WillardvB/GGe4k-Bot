const rollen = require('./../data/rollen.json');

module.exports = {
  isModPlus: function(member){
    return isRolModeratorOfHoger(member);
  },
	isGeenMod: function(member){
    return !isRolModeratorOfHoger(member);
  },
  isGeenAdmin: function(member){
    return !isRolAdmin(member);
  },
  isAdmin: function(member){
    return isRolAdmin(member);
  }
};

function isRolModeratorOfHoger(member){
  const hoogsteRol = ""+member.roles.highest.id;
  if(hoogsteRol == rollen.server.moderator){
    return true;
  }
  else if(hoogsteRol == rollen.server.srModerator){
    return true;
  }
  else if(hoogsteRol == rollen.server.admin){
    return true;
  }
  else{
    return false;
  }
}

function isRolAdmin(member){
  const hoogsteRol = ""+member.roles.highest.id;
  if(hoogsteRol == rollen.server.admin){
    return true;
  }
  else{
    return false;
  }
}