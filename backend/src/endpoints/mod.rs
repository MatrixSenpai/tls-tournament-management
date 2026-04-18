mod tournament;
mod team;
mod player;
mod match_set;

use actix_web::web::{
    scope, ServiceConfig,
};

pub fn api_routes(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/api/v1")
            .configure(tournament::tournament_routes)
            .configure(team::team_routes)
            .configure(player::player_routes)
            .configure(match_set::match_routes)
    );
}